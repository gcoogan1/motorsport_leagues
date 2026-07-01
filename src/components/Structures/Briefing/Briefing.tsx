import { Wrapper } from "./Briefing.styles";

type BriefingProps = {
  content: string;
}

const Briefing = ({ content }: BriefingProps) => {
  return (
    <Wrapper>
      <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: content }} />
    </Wrapper>
  )
}

export default Briefing