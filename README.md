### **PROJECT FOLDER STRUCTURE**
```
virtual-casino/
├── node_modules/             # Dependencies installed via npm
├── public/                   # Static assets
│   ├── css/                  # Stylesheets
│   │   └── style.css         # Custom styles for your casino
│   ├── js/                   # Frontend JavaScript files
│   │   └── scripts.js        # Optional client-side game logic
│   ├── images/               # Optional folder for casino-related images
│   ├── index.html            # Main HTML for the casino (e.g., landing page)
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   └── dashboard.html        # Casino dashboard (e.g., credits, games)
├── src/                      # Source code for the application
│   ├── controllers/          # Controllers for handling logic
│   │   ├── userController.js
│   │   ├── blackjackController.js
│   │   ├── slotsController.js
│   │   └── rouletteController.js
│   ├── database/             # SQLite database and related files
│   │   ├── db.js             # SQLite connection and setup
│   │   └── casino.sqlite     # SQLite database file
│   ├── models/               # Models for database queries
│   │   └── userModel.js      # User-related database operations
│   ├── routes/               # API route definitions
│   │   ├── userRoutes.js
│   │   ├── blackjackRoutes.js
│   │   ├── slotsRoutes.js
│   │   └── rouletteRoutes.js
│   ├── middlewares/          # Optional middleware (e.g., authentication)
│   │   └── auth.js           # Authentication middleware
│   ├── app.js                # Express app setup and configuration
│   └── server.js             # Entry point for the server
├── .env                      # Environment variables (e.g., PORT)
├── .gitignore                # Ignoring node_modules, database, etc.
├── package.json              # Project metadata and dependencies
└── README.md                 # Project description and usage instructions
```
### **Paint Drop: The Virtual Casino Currency**

In our virtual casino, we’ve created a unique currency that ties into the theme of the casino: **Paint Drop**! Inspired by the creative world of painting, each *Paint Drop* represents a unit of currency used to place bets and interact with games within the casino.

#### **What Are Paint Drops?**
*Paint Drops* are the core currency used to play all games in the casino. Players will use these to bet on various games, such as Blackjack, Roulette, and Slots, and can earn more *Paint Drops* as they win! The more *Paint Drops* you have, the more you can play and win.

#### **Why Paint Drops?**
The choice of *Paint Drops* as our currency ties directly into the theme of the casino, which is centered around creativity, art, and painting. Instead of traditional money or chips, players will use **drops of paint** to interact with the casino, giving the experience a fun and immersive twist.

#### **How Do Paint Drops Work?**

- **Earning Paint Drops**: Players start with a set number of *Paint Drops*, which they can use to place bets. Winning games or completing challenges will reward players with more *Paint Drops*.
  
- **Betting with Paint Drops**: Just like traditional casino chips, you can bet *Paint Drops* in games such as Blackjack, Roulette, and Slots. For example:
  - *Blackjack*: Bet 50 *Paint Drops* on a hand of Blackjack.
  - *Roulette*: Bet 100 *Paint Drops* on a red or black outcome.
  - *Slots*: Spin the wheel for a chance to win more *Paint Drops*!

- **Winning and Losing**: As you win, your balance of *Paint Drops* will increase. Losing a bet will reduce your *Paint Drops* balance, so manage them wisely!

- **Special Rewards**: As you accumulate more *Paint Drops*, you can unlock new rewards or special features in the casino.

#### **Paint Drop Features**
- **Iconography**: Each *Paint Drop* is represented visually as a colorful drop of paint, which can be seen in your user profile, game interfaces, and even during animations (such as when you win or lose).
- **Color Variations**: To make things even more interesting, different games may reward you with *Paint Drops* of different colors. For example:
  - **Red Paint Drops** for **Blackjack**
  - **Blue Paint Drops** for **Roulette**
  - **Yellow Paint Drops** for **Slots**
  
- **Paint Drop Animation**: Watch as *Paint Drops* drip down the screen when you place a bet or win a game, adding to the immersive experience!

#### **Database Integration**
The *Paint Drops* currency is tracked in the database, and each user’s balance is updated based on their winnings, bets, and losses. Here’s how it’s stored:
```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    credits INTEGER DEFAULT 1000,
    profit INTEGER DEFAULT 0,
    paint_drops INTEGER DEFAULT 0,  -- User's paint-themed currency
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
### **Convert Paint Drops to Real Money**
If you want to turn your virtual winnings into real-world rewards, you can convert your Paint Drops into real money (credits) based on the in-game exchange rate.

### **How to Use Paint Drops in the Casino**
Login Page: When you log in, you'll see your current Paint Drop balance, letting you know how much you can play with.
Game Pages: Place your Paint Drop bets on any of the available games. Each game shows you the cost of each bet in Paint Drops.
Balance Updates: As you win or lose, your Paint Drop balance will be updated in real time.