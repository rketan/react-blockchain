# ZotChain - Counterfeit Product Detection Using Blockchain

<img width="852" alt="Screen Shot 2022-06-26 at 11 31 21 AM" src="https://user-images.githubusercontent.com/94927745/175828958-617aaf3d-b306-4aed-ac62-eb4d21b70083.png">

-----------------------------------------------------------------------------------------------------------------------------------------------------------

### Product Demo: https://youtu.be/4wyHyo2Xndw

-----------------------------------------------------------------------------------------------------------------------------------------------------------

## To run the application

1. Install Ganache

https://trufflesuite.com/ganache/index.html

2. Install Metamask Chrome Extension

https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en

3. Download any IDE

4. Check the port ganache is running on

Generally it should be 127.0.0.1:7545 or 127.0.0.1:8545 
Update truffle-config.js accordingly

5. Connect to your local account in Metamask

http://blockchainsfalcon.com/using-ganache-ethereum-emulator-with-metamask/

6. Install truffle

npm install -g truffle

7. Migrate

cd /path-to-the-repo/ 
truffle migrate --reset

8. Start the front-end server

cd /path-to-the-repo 
npm install 
npm run dev (should default use 3000 port)
