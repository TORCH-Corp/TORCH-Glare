import { FieldSection, RadioCard } from "@/index";

function App() {
  return (
    <section>
      <FieldSection
        hideInputField
        component_size="M"
        secondary_label=""
        label={'company_name'}
        required_label={'required'}
        name={"companyName"}
        childrenAtTheTop={
          <section className="test">
            <RadioCard
              label="Exist Domain"
              description_child="Manage Your Finance in One Unified Place"
              learn_more_label="Learn More!"
              is_selected={false}
            />
            <RadioCard
              label="Create a TORCH Domain"
              description_child={<p>If Your Company don’t Have A Domain Name, You Can Use Our Local Domain Name [user@company.<a>trc</a>]</p>}
              learn_more_label=""
              is_selected={false}
            />
          </section>
        }
      />
    </section>
  );
}

export default App;
