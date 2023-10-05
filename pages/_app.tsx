import localFont from 'next/font/local';
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { Web3OnboardProvider, init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseModule from '@web3-onboard/coinbase'
import tahoModule from '@web3-onboard/taho'

const inter = localFont({
  src: [
    {
      path: '../asset/Inter/Inter-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../asset/Inter/Inter-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../asset/Inter/Inter-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../asset/Inter/Inter-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../asset/Inter/Inter-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../asset/Inter/Inter-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
});


const injected = injectedModule();
const coinbase = coinbaseModule();
const walletConnect = walletConnectModule();
const taho = tahoModule();

const wallets = [
  injected,
  taho,
  coinbase,
  walletConnect
]

const chains = [
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: getRpcUrl('0x1')
  },
  {
    id: '0x5',
    token: 'ETH',
    label: 'Goerli',
    rpcUrl: getRpcUrl('0x5')
  },
  {
    id: '0xaa36a7',
    token: 'ETH',
    label: 'Sepolia',
    rpcUrl: getRpcUrl('0xaa36a7')
  },
]

const appMetadata = {
  name: 'Connect Wallet Example',
  icon: '<svg>My App Icon</svg>',
  description: 'Example showcasing how to connect a wallet.',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
  ]
}

const accountCenter = {
  enabled: false
}

const accountCenterOptions = {
  desktop: accountCenter,
  mobile: accountCenter
}

const web3Onboard = init({
  wallets,
  chains,
  appMetadata,
  accountCenter: accountCenterOptions
})

function getRpcUrl(chainIdHex: '0x1' | '0x5' | '0xaa36a7') {
  const publicRpcUrls = {
    '0x1': 'https://cloudflare-eth.com/',
    '0x5': 'https://goerli.eth.aragon.network/',
    '0xaa36a7': 'https://sepolia.eth.aragon.network/'
  };

  if (process.env.REACT_APP_INFURA_ID) {
    return `https://eth-${chainIdHex === '0x1' ? 'mainnet' : chainIdHex === '0x5' ? 'goerli' : 'sepolia'}.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_ID}`;
  } else {
    return publicRpcUrls[chainIdHex];
  }
}

type EthersWeb3ReactProviderProps = {
  children: JSX.Element;
}

const OnboardProvider= ({ children }: EthersWeb3ReactProviderProps): JSX.Element => {
  return (
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      {children}
    </Web3OnboardProvider>
  );
};


export default function App({ Component, pageProps }: AppProps) {
  return <OnboardProvider>
    <main
      className={`${inter.variable} font-sans`}
    >
      <Component className={`${inter.variable} font-sans`} {...pageProps} />
    </main>
  </OnboardProvider>
}
