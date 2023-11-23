import ChooseUsernameForm from "@/components/forms/ChooseUsernameForm";
import { FC } from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

interface pageProps {}
const page: FC<pageProps> = ({}) => {
  return (
    <div className="grid place-items-center h-screen">
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md">Choose a username</p>
            <p className="text-small text-default-500">
              Choose a unique username
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <ChooseUsernameForm />
        </CardBody>
      </Card>
    </div>
  );
};
export default page;
