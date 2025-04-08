'use client';
import { InputOTPSeparator } from "@/components/InputOTP";
import { InputOTP } from "@/components/InputOTP";
import { InputOTPSlot } from "@/components/InputOTP";
import { InputOTPGroup } from "@/components/InputOTP";
import Examples from "../exmples";
import { ScrollArea } from "@/components/ScrollArea";
import { Divider } from "@/components/Divider";

export default function page() {

  const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  )

  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none text-content-presentation-global-primary">Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm text-content-presentation-global-primary">
              {tag}
            </div>
            <Divider className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}


// using with react hook form lib
/*
     <InputGroup >
        <Icon>
          <i className="ri-mail-ai-line"></i>
        </Icon>
        <Input />
      </InputGroup>

      <InputField icon={<i className="ri-mail-ai-line"></i>} />
*/