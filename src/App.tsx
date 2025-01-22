import TabFormItem from "@/components/base/tabFormItem";
import "@/styles/globals.css";

function App() {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <TabFormItem buttonType="icon" componentType="top">
        <i className="ri-add-line"></i>
      </TabFormItem>
    </div>
  );
}
export default App;
