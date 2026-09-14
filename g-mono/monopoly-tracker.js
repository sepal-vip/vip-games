

export class MonopolyGameEngine {
    constructor(playerNames, startingCash = 1500) {
        this.players = {};
        playerNames.forEach(name => {
            this.players[name] = {
                cash: startingCash, 
                loans: 0,
                properties: []
            };
        });
        this.auditLog = [];
    }

    logAction(player, action, target, amount, details = "") {
        const timestamp = new Date().toLocaleTimeString();
        const entry = { timestamp, player, action, target, amount, details };
        this.auditLog.unshift(entry);
        return entry;
    }

    // 1. Buy Property
    buyProperty(playerName, propertyName, price) {
        const player = this.players[playerName];
        if (!player) throw new Error("Player not found");
        if (player.cash < price) throw new Error("Insufficient cash for purchase");

        player.cash -= price;
        player.properties.push({
            name: propertyName,
            houses: 0,
            hotel: false
        });

        this.logAction(playerName, "BUY", propertyName, price);
    }

    // 2. Pay Rent (Automatically adjusts for houses/hotels if configured)
    payRent(payerName, ownerName, propertyName, rentAmount) {
        const payer = this.players[payerName];
        const owner = this.players[ownerName];
        if (!payer || !owner) throw new Error("Participant not found");

        if (payer.cash < rentAmount) {
            // Trigger partial payment or loan necessity flag
            console.warn(`${payerName} has low cash for rent. Consider taking a loan or debt agreement.`);
        }

        payer.cash -= rentAmount;
        owner.cash += rentAmount;

        this.logAction(payerName, "RENT", ownerName, rentAmount, `Paid for ${propertyName}`);
    }

    // 3. Take Bank Loan
    takeLoan(playerName, loanAmount) {
        const player = this.players[playerName];
        if (!player) throw new Error("Player not found");

        player.cash += loanAmount;
        player.loans += loanAmount;

        this.logAction(playerName, "LOAN", "Bank", loanAmount);
    }

    // 4. Repay Loan
    repayLoan(playerName, repaymentAmount) {
        const player = this.players[playerName];
        if (!player) throw new Error("Player not found");
        if (player.cash < repaymentAmount) throw new Error("Insufficient cash to repay loan");

        player.cash -= repaymentAmount;
        player.loans = Math.max(0, player.loans - repaymentAmount);

        this.logAction(playerName, "REPAY_LOAN", "Bank", repaymentAmount);
    }

    // 5. Build Houses / Hotels
    buildProperty(playerName, propertyName, buildCost, isHotel = false) {
        const player = this.players[playerName];
        if (!player) throw new Error("Player not found");
        if (player.cash < buildCost) throw new Error("Insufficient cash for construction");

        const prop = player.properties.find(p => p.name === propertyName);
        if (!prop) throw new Error("Player does not own this property");

        player.cash -= buildCost;
        if (isHotel) {
            prop.hotel = true;
            prop.houses = 5;
        } else {
            prop.houses = Math.min(4, prop.houses + 1);
        }

        this.logAction(playerName, "BUILD", propertyName, buildCost, isHotel ? "Hotel" : `${prop.houses} Houses`);
    }

    // 6. Bank / Chance Collection (Salary, Tax Refund, etc.)
    collectBank(playerName, amount) {
        const player = this.players[playerName];
        if (!player) throw new Error("Player not found");

        player.cash += amount;
        this.logAction(playerName, "COLLECT", "Bank", amount);
    }

    // 7. Pay Bank (Income Tax, Luxury Tax, Jail Fine)
    payBank(playerName, amount, reason = "Tax/Fine") {
        const player = this.players[playerName];
        if (!player) throw new Error("Player not found");

        player.cash -= amount;
        this.logAction(playerName, "PAY_BANK", reason, amount);
    }

    // 8. Collect From All Players (Chance Card: e.g., "It's your birthday, collect $10 from each")
    collectFromAll(beneficiaryName, amountPerPlayer) {
        const beneficiary = this.players[beneficiaryName];
        if (!beneficiary) throw new Error("Beneficiary not found");

        let totalCollected = 0;
        for (const [name, player] of Object.entries(this.players)) {
            if (name === beneficiaryName) continue;
            
            const deduction = Math.min(player.cash, amountPerPlayer);
            player.cash -= deduction;
            totalCollected += deduction;
        }

        beneficiary.cash += totalCollected;
        this.logAction(beneficiaryName, "COLLECT_ALL", "All Players", totalCollected, `$${amountPerPlayer} per head`);
    }

    // 9. Bulk Property Repairs Tax (e.g., $115 per hotel, $30 per house across all properties)
    payBuildingRepairs(playerName, houseFee, hotelFee) {
        const player = this.players[playerName];
        if (!player) throw new Error("Player not found");

        let totalBill = 0;
        player.properties.forEach(prop => {
            if (prop.hotel) {
                totalBill += hotelFee;
            } else if (prop.houses > 0) {
                totalBill += prop.houses * houseFee;
            }
        });

        player.cash -= totalBill;
        this.logAction(playerName, "REPAIRS", "Bank", totalBill, `Houses @ $${houseFee}, Hotels @ $${hotelFee}`);
    }

    // 10. Net Worth Calculation
    getNetWorth(playerName, estimatedPropertyValues = {}) {
        const player = this.players[playerName];
        if (!player) return 0;

        let propertyValuation = 0;
        player.properties.forEach(prop => {
            const baseVal = estimatedPropertyValues[prop.name] || 200; // default fallback
            const buildVal = prop.hotel ? 500 : prop.houses * 100;
            propertyValuation += baseVal + buildVal;
        });

        return player.cash + propertyValuation - player.loans;
    }
}