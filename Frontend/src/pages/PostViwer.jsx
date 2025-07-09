import DOMPurify from 'dompurify';

const PostViewer = ({ content }) => {
  return (
    <div
      className="whitespace-pre-line text-white"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
    />
  );
};

export default PostViewer;
