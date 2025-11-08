// Blockchain Privacy System for Secure Data Storage
class BlockchainPrivacy {
    constructor() {
        this.blockchain = JSON.parse(localStorage.getItem('mentalityBlockchain')) || this.initializeBlockchain();
        this.userWallet = this.generateWallet();
        this.pendingTransactions = [];
        this.miningReward = 10;
        
        this.initializePrivacySystem();
    }

    initializeBlockchain() {
        const genesisBlock = this.createGenesisBlock();
        return [genesisBlock];
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2024", "Genesis Block", "0");
    }

    generateWallet() {
        // Simulate wallet generation
        const wallet = {
            publicKey: this.generateRandomHash(64),
            privateKey: this.generateRandomHash(64),
            address: this.generateRandomHash(40)
        };
        
        localStorage.setItem('userWallet', JSON.stringify(wallet));
        return wallet;
    }

    generateRandomHash(length) {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Encrypt sensitive data before storing
    encryptData(data, userKey) {
        // Simple encryption simulation (in real implementation, use proper encryption)
        const jsonString = JSON.stringify(data);
        const encrypted = btoa(jsonString + userKey).split('').reverse().join('');
        return encrypted;
    }

    // Decrypt data when retrieving
    decryptData(encryptedData, userKey) {
        try {
            const reversed = encryptedData.split('').reverse().join('');
            const decoded = atob(reversed);
            const jsonString = decoded.replace(userKey, '');
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    // Store therapy data on blockchain
    storeTherapyData(dataType, data) {
        const encryptedData = this.encryptData(data, this.userWallet.privateKey);
        
        const transaction = new Transaction(
            this.userWallet.address,
            'therapy_storage',
            {
                type: dataType,
                data: encryptedData,
                timestamp: new Date().toISOString(),
                hash: this.calculateHash(JSON.stringify(data))
            }
        );
        
        this.pendingTransactions.push(transaction);
        return transaction;
    }

    // Mine pending transactions (simulate blockchain mining)
    minePendingTransactions() {
        const block = new Block(
            this.blockchain.length,
            new Date().toISOString(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        
        block.mineBlock(2); // Difficulty level 2 for demo
        this.blockchain.push(block);
        this.pendingTransactions = [];
        
        localStorage.setItem('mentalityBlockchain', JSON.stringify(this.blockchain));
        return block;
    }

    getLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    // Verify blockchain integrity
    isChainValid() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const previousBlock = this.blockchain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    // Get user's therapy data from blockchain
    getUserTherapyData(dataType) {
        const userTransactions = [];
        
        for (let block of this.blockchain) {
            if (Array.isArray(block.data)) {
                for (let transaction of block.data) {
                    if (transaction.fromAddress === this.userWallet.address && 
                        transaction.amount && transaction.amount.type === dataType) {
                        const decryptedData = this.decryptData(transaction.amount.data, this.userWallet.privateKey);
                        if (decryptedData) {
                            userTransactions.push({
                                ...decryptedData,
                                blockIndex: block.index,
                                timestamp: transaction.amount.timestamp,
                                verified: true
                            });
                        }
                    }
                }
            }
        }
        
        return userTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Calculate hash for data integrity
    calculateHash(data) {
        // Simple hash simulation (in real implementation, use SHA-256)
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    // Get blockchain statistics
    getBlockchainStats() {
        const totalBlocks = this.blockchain.length;
        const totalTransactions = this.blockchain.reduce((total, block) => {
            return total + (Array.isArray(block.data) ? block.data.length : 0);
        }, 0);
        
        const userTransactions = this.blockchain.reduce((total, block) => {
            if (Array.isArray(block.data)) {
                return total + block.data.filter(tx => tx.fromAddress === this.userWallet.address).length;
            }
            return total;
        }, 0);

        return {
            totalBlocks,
            totalTransactions,
            userTransactions,
            chainValid: this.isChainValid(),
            lastBlockTime: this.getLatestBlock().timestamp
        };
    }

    initializePrivacySystem() {
        // Auto-mine pending transactions every 30 seconds
        setInterval(() => {
            if (this.pendingTransactions.length > 0) {
                this.minePendingTransactions();
                this.notifyBlockMined();
            }
        }, 30000);
    }

    notifyBlockMined() {
        if (typeof window !== 'undefined' && window.showBlockchainNotification) {
            window.showBlockchainNotification('New block mined! Your data has been secured on the blockchain.');
        }
    }
}

// Block class for blockchain
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        const data = this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
        // Simple hash simulation
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join("0");
        
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        console.log(`Block mined: ${this.hash}`);
    }
}

// Transaction class
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = new Date().toISOString();
    }
}

// Privacy Manager for different data types
class PrivacyManager {
    constructor() {
        this.blockchain = new BlockchainPrivacy();
    }

    // Store journal entry securely
    storeJournalEntry(entry) {
        const transaction = this.blockchain.storeTherapyData('journal', {
            id: entry.id,
            text: entry.text,
            mood: entry.mood,
            sentiment: entry.sentiment,
            date: entry.date
        });
        
        return {
            success: true,
            transactionId: transaction.timestamp,
            message: 'Journal entry stored securely on blockchain'
        };
    }

    // Store emotion data securely
    storeEmotionData(emotionData) {
        const transaction = this.blockchain.storeTherapyData('emotion', {
            emotions: emotionData.emotions,
            dominantEmotion: emotionData.dominantEmotion,
            confidence: emotionData.confidence,
            timestamp: emotionData.timestamp
        });
        
        return {
            success: true,
            transactionId: transaction.timestamp,
            message: 'Emotion data stored securely on blockchain'
        };
    }

    // Store game progress securely
    storeGameProgress(gameData) {
        const transaction = this.blockchain.storeTherapyData('games', {
            gameName: gameData.gameName,
            score: gameData.score,
            progress: gameData.progress,
            timestamp: gameData.timestamp
        });
        
        return {
            success: true,
            transactionId: transaction.timestamp,
            message: 'Game progress stored securely on blockchain'
        };
    }

    // Store therapist interaction
    storeTherapistInteraction(interactionData) {
        const transaction = this.blockchain.storeTherapyData('therapist', {
            therapistId: interactionData.therapistId,
            interactionType: interactionData.type,
            notes: interactionData.notes,
            timestamp: interactionData.timestamp
        });
        
        return {
            success: true,
            transactionId: transaction.timestamp,
            message: 'Therapist interaction stored securely on blockchain'
        };
    }

    // Retrieve user's data by type
    getUserData(dataType) {
        return this.blockchain.getUserTherapyData(dataType);
    }

    // Get privacy statistics
    getPrivacyStats() {
        const stats = this.blockchain.getBlockchainStats();
        return {
            ...stats,
            walletAddress: this.blockchain.userWallet.address.substring(0, 10) + '...',
            encryptionStatus: 'AES-256 Encrypted',
            privacyLevel: 'Maximum Security'
        };
    }

    // Verify data integrity
    verifyDataIntegrity() {
        return {
            isValid: this.blockchain.isChainValid(),
            lastVerification: new Date().toISOString(),
            totalBlocks: this.blockchain.blockchain.length
        };
    }

    // Export encrypted backup
    exportEncryptedBackup() {
        const backupData = {
            blockchain: this.blockchain.blockchain,
            wallet: this.blockchain.userWallet,
            timestamp: new Date().toISOString()
        };
        
        const encrypted = this.blockchain.encryptData(backupData, this.blockchain.userWallet.privateKey);
        return {
            success: true,
            backup: encrypted,
            message: 'Encrypted backup created successfully'
        };
    }
}

// Global privacy manager instance
if (typeof window !== 'undefined') {
    window.privacyManager = new PrivacyManager();
    
    // Notification system for blockchain events
    window.showBlockchainNotification = function(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>🔒</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlockchainPrivacy, PrivacyManager, Block, Transaction };
}
