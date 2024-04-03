import { Button } from "@/collection/ui/button";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
} from "@/collection/ui/card";
import { Tab, TabList, TabPanel, Tabs } from "@/collection/ui/tabs";
import { TextField } from "@/collection/ui/text-field";

export default function Demo() {
  return (
    <Tabs defaultSelectedKey="1" className="w-[400px]">
      <TabList aria-label="tab-list">
        <Tab id="1">Account</Tab>
        <Tab id="2">Password</Tab>
      </TabList>
      <TabPanel id="1" className="p-0">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you are done.
              </CardDescription>
            </CardHeading>
          </CardHeader>
          <CardBody className="space-y-4">
            <TextField label="name" defaultValue="Pedro Duarte" />
            <TextField label="username" defaultValue="@peduarte" />
          </CardBody>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabPanel>
      <TabPanel id="2" className="p-0">
        <Card>
          <CardHeader>
            <CardHeading>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you will be logged out.
              </CardDescription>
            </CardHeading>
          </CardHeader>
          <CardBody className="space-y-4">
            <TextField type="password" label="Current Password" />
            <TextField type="password" label="New Password" />
          </CardBody>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabPanel>
    </Tabs>
  );
}
