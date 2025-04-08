'use client';
import { InputOTPSeparator } from "@/components/InputOTP";
import { InputOTP } from "@/components/InputOTP";
import { InputOTPSlot } from "@/components/InputOTP";
import { InputOTPGroup } from "@/components/InputOTP";
import Examples from "../exmples";

export default function page() {


  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>

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