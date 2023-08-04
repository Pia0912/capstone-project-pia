import styled from "@emotion/styled";
import BubblyButton from "./BubblyButton.tsx";



export default function InAppPurchase() {

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Add your desired logic for handling the button click here
        console.log("Button clicked!");
    };

    return (
        <div className="app-purchase">
            <h2>This Page is locked 🥲</h2>
            <h6>But dont be sad - spending money is not that bad..</h6>

            <PurchaseOptions>
                <OptionCard>
                    <OptionTitle>Badge Hunter</OptionTitle>
                    <OptionPrice>$2.99</OptionPrice>
                    <OptionDescription>
                        Get access to all our challenges
                    </OptionDescription>
                    <BubblyButton onClick={handleButtonClick} />
                </OptionCard>
                <OptionCard>
                    <OptionTitle>Unlimited Access</OptionTitle>
                    <OptionPrice>$9.99</OptionPrice>
                    <OptionDescription>
                        Get unlimited access to all tools & evaluations!
                    </OptionDescription>
                    <BubblyButton onClick={handleButtonClick} />
                </OptionCard>
                <OptionCard>
                    <OptionTitle>Remove Ads</OptionTitle>
                    <OptionPrice>$2.99</OptionPrice>
                    <OptionDescription>
                        Enjoy an ad-free experience.
                    </OptionDescription>
                    <BubblyButton onClick={handleButtonClick} />
                </OptionCard>
            </PurchaseOptions>
        </div>
    );
}

const PurchaseOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 1rem;
`;

const OptionCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem 1rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
`;

const OptionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 1rem;
`;

const OptionPrice = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

const OptionDescription = styled.p`
  font-size: 10px;
  color: #555;
  margin-bottom: 1rem;
`;


