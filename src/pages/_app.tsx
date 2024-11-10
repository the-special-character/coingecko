import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createStore, Provider } from "jotai";
const myStore = createStore();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={myStore}>
      <Component {...pageProps} />
    </Provider>
  );
}
