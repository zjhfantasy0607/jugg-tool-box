import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      fontFamily: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      height: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000',
      margin: 0,
    }}>
      <style>{`
        .next-error-h1 {
          border-right: 1px solid rgba(0, 0, 0, .3);
        }
        @media (prefers-color-scheme: dark) {
          body {
            color: #fff;
            background: #000;
          }
          .next-error-h1 {
            border-right: 1px solid rgba(255, 255, 255, .3);
          }
        }
      `}</style>
      <div className=''>
        <h1 className="next-error-h1" style={{
          display: 'inline-block',
          margin: '0 20px 0 0',
          padding: '0 23px 0 0',
          fontSize: '24px',
          fontWeight: 500,
          verticalAlign: 'top',
          lineHeight: '49px'
        }}>404</h1>
        <div style={{ display: 'inline-block' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '49px',
            margin: 0
          }}>This page could not be found.</h2>
        </div>
      </div>
      <Link className='mb-32' href="/"><button className="btn btn-primary rounded mt-4 min-h-10 h-10">Return Home</button></Link>
    </div>
  );
}
