import { ExternalProvider } from "@ethersproject/providers";
declare global {
  interface Window {
    ethereum: ExternalProvider;
  }
  module '*.mp4'
}

window.ethereum = window.ethereum || undefined;

