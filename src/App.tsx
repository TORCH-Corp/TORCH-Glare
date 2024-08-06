import { FieldSection, RadioCard } from "@/index";

function App() {
  return (
    <section>
      <FieldSection
        component_size="M"
        secondary_label=""
        label={'company_name'}
        required_label={'required'}
        name={"companyName"}
        childrenAtTheTop={
          <section >
            <RadioCard label={"Radio Label"} description={"Your Company Account Will be Linked to Your Company Exist Domain"} learn_more_label={"Learn More"} is_selected={false} />
            <RadioCard label={"Radio Label"} description={"Your Company Account Will be Linked to Your Company Exist Domain"} learn_more_label={"Learn More"} is_selected={false} />
          </section>
        }
      />
    </section>
  );
}

export default App;
