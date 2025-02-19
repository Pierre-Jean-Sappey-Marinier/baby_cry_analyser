import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeContainer,
  HeroSection,
  Title,
  Subtitle,
  FeatureSection,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  CTAButton,
} from "./styles";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    navigate("/analysis");
  };

  return (
    <HomeContainer>
      <HeroSection>
        <Title>Welcome to BabyCry Analyzer</Title>
        <Subtitle>
          Understand your baby's needs instantly with our advanced AI-powered
          cry analysis
        </Subtitle>
        <CTAButton onClick={handleStartAnalysis}>Start Analysis</CTAButton>
      </HeroSection>

      <FeatureSection>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Accurate Analysis</FeatureTitle>
            <FeatureDescription>
              Our AI model provides highly accurate predictions of your baby's
              needs based on cry patterns
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Real-Time Results</FeatureTitle>
            <FeatureDescription>
              Get instant feedback and analysis of your baby's cries
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>History Tracking</FeatureTitle>
            <FeatureDescription>
              Keep track of patterns and changes in your baby's crying behavior
              over time
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Privacy First</FeatureTitle>
            <FeatureDescription>
              All processing is done locally on your device, ensuring your
              baby's data stays private
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeatureSection>
    </HomeContainer>
  );
};
