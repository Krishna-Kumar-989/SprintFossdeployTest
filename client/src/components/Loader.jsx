export default function Loader({ style = {} }) {
  return (
    <div 
      className="loader" 
      style={{ margin: '2rem auto', ...style }}
    />
  );
}
