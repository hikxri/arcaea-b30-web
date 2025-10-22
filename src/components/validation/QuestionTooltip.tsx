import { Icon } from "@chakra-ui/react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { Tooltip } from "../ui/tooltip";

export default function QuestionToolTip({ text }: { text: string }) {
  return (
    <Tooltip content={text} showArrow positioning={{ placement: "top" }}>
      <Icon>
        <BsFillQuestionCircleFill />
      </Icon>
    </Tooltip>
  )
}