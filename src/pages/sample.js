import { ethers } from "ethers";
import { getPolicyDetails } from "@/config/Services";

function Page() {
  const [accounts, setAccounts] = useState([]);
  const [policydata, setPolicyData] = useState();

  useEffect(() => {
    const connectToWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccounts(accounts);
            const policy = await getPolicyDetails({ _insured: accounts[0] });
            setPolicyData(policy);
          }
        } catch (error) {
          console.error("Error connecting:", error);
        }
      }
    };
    connectToWeb3();
  }, []);
}