import { Tab, TabList, TabPanel, Tabs } from "@/collection/ui/tabs";

export default function Example() {
  return (
    <Tabs defaultSelectedKey="1" orientation="vertical">
      <TabList>
        <Tab id="1">Tab 1</Tab>
        <Tab id="2">Tab 2</Tab>
        <Tab id="3">Tab 3</Tab>
      </TabList>
      <TabPanel id="1">Panel 1</TabPanel>
      <TabPanel id="2">Panel 2</TabPanel>
      <TabPanel id="3">Panel 3</TabPanel>
    </Tabs>
  );
}
