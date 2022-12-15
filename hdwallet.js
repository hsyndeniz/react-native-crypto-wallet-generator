import * as ed25519 from 'ed25519-hd-key';
import { base58 } from "ethers/lib/utils";
import { hdkey } from 'ethereumjs-wallet';
import * as bip39 from 'bip39';
import nacl from 'tweetnacl';
import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import xrpl, { Wallet } from 'xrpl';

const bip32 = BIP32Factory(ecc)

/*
  index is account index. You can increment it to generate multiple accounts
*/
export const getHDWallet = (index) => {
  try {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Wallet Derivation Paths
    const eth_path = `m/44'/60'/0'/0/${index}`;
    const sol_path = `m/44'/501'/${index}'/0'`;
    const btc_path = `m/0'/0/${index}`;
    const xrp_path = `m/44'/144'/0'/0/${index}`;

    // ETH
    const hd_wallet = hdkey.fromMasterSeed(seed);
    const wallet = hd_wallet.derivePath(eth_path).getWallet();
    const address = wallet.getAddressString();
    const publicKey = wallet.getPublicKeyString();
    const privateKey = wallet.getPrivateKeyString();

    // SOL
    let derivedPrivateKey = ed25519.derivePath(sol_path, seed.toString('hex'));
    let keyPair = nacl.sign.keyPair.fromSeed(derivedPrivateKey.key);

    const solana = {
      publicKey: base58.encode(keyPair.publicKey),
      secretKey: base58.encode(keyPair.secretKey),
    }

    // BTC
    const btc = bip32.fromSeed(seed);
    const btc_wallet = btc.derivePath(btc_path);

    const bitcoin = {
      address: getAddress(btc_wallet, bitcoin),
      publicKey: btc_wallet.publicKey.toString('hex'),
      privateKey: btc_wallet.privateKey.toString('hex'),
    }

    // XRP    
    let xrp_wallet = Wallet.fromMnemonic(mnemonic, {
      derivationPath: xrp_path,
      mnemonicEncoding: 'bip39'
    });

    const ripple = {
      classicAddress: xrp_wallet.classicAddress,
      publicKey: xrp_wallet.publicKey,
      privateKey: xrp_wallet.privateKey,
    }

    return {
      mnemonic,
      ethereum: {
        address,
        privateKey,
      },
      solana,
      bitcoin,
      ripple
    };
  } catch (error) {
    console.log(error);
  }
}

// get bitcoin address from public key
function getAddress(node) {
  return bitcoin.payments.p2pkh({ pubkey: node.publicKey }).address;
}

