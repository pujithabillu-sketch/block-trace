import { useEffect, useState } from "react";
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const reconnect = async () => {
      try {
        const accounts = await peraWallet.reconnectSession();

        if (accounts.length > 0) {
          setAddress(accounts[0]);
        }
      } catch (error) {
        console.log("No previous Pera session");
      }
    };

    reconnect();
  }, []);

  const connectWallet = async () => {
    try {
      setConnecting(true);

      const accounts = await peraWallet.connect();

      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    peraWallet.disconnect();
    setAddress(null);
  };

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-6)}`
    : "";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {address ? (
        <>
          <div
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              background: "#e8f8f5",
              color: "#087f73",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            🟢 {shortAddress}
          </div>

          <button
            onClick={disconnectWallet}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          disabled={connecting}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            background: "#00a99d",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {connecting ? "Connecting..." : "Connect Pera Wallet"}
        </button>
      )}
    </div>
  );
}