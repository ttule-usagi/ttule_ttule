export default function Loader() {
  return (
    <div className='flex flex-col items-center'>
      <div className='tomato-loader'>
        <div className='tomato-loader__body'>
          <div className='tomato-loader__star' />
        </div>
      </div>
      <p className='text-typo-description text-tag-green-text mt-3'>로딩중...</p>
    </div>
  );
}
