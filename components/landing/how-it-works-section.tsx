import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import SectionHeading from "./section-heading";

const steps = [
  {
    title: "Pick a community",
    description:
      "Browse communities and join the ones that match what you're trying to learn.",
  },
  {
    title: "Add your goals",
    description:
      "Tell us what you want to learn, where you're at, and what you're working on.",
  },
  {
    title: "Get matched",
    description:
      "We'll find someone with similar goals and pair you up for accountability.",
  },
  {
    title: "Start learning",
    description:
      "Message your match, set up sessions, and help each other stay on track.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <SectionHeading
          title="How It Works"
          description="Get matched with your ideal learning partner in four simple steps"
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <Card
              key={idx}
              className="hover:scale-105 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="step-number">{idx + 1}</div>
                </div>

                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
