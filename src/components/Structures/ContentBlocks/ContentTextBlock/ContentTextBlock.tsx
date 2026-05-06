type ContentTextBlockProps = {
  title: string;
  message: string;
};

const ContentTextBlock = ({ title, message }: ContentTextBlockProps) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  )
}

export default ContentTextBlock