import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex bg-background-system-body-base  flex-col items-center overflow-hidden justify-center h-full rounded-[6px] text-white">
      <div className="text-center space-y-6">
        {/* Logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 96 115"
          fill="none"
          className="mb-8 w-[406px] absolute top-[300px] [&>path]:fill-[#0077ff5b]  z-[1] h-auto"
        >
          <path
            d="M80.3029 37.5255L84.6427 16.1729L78.8182 21.9963L80.3029 37.5255Z"
            fill="#C6C6C6"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M78.8299 22.0004L58.0952 0.213531L84.6758 16.1084L78.8299 22.0004Z"
            fill="#A0A0A0"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M88.5508 20.813L84.6678 16.1086L80.3052 37.5297L88.5508 20.813Z"
            fill="#D4D4D4"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M95.2889 60.9141L80.3052 37.5062L88.5736 20.8579L95.2889 60.9141Z"
            fill="#797C7F"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M81.7128 82.7223L95.2802 60.9129L90.7578 53.8791L81.7128 82.7223Z"
            fill="#797C7F"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M90.7665 53.8557L80.3054 37.5044L79.2319 40.7244L90.7665 53.8557Z"
            fill="#C6C6C6"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M81.7223 82.7266L79.2555 40.7521L90.7673 53.8834L81.7223 82.7266Z"
            fill="#A0A0A0"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M75.0966 47.5059L79.2764 40.9973L80.4413 60.7514L75.0966 47.5059Z"
            fill="#D4D4D4"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M81.2179 74.1591L75.0966 47.5082L80.4413 60.6852L81.2179 74.1591Z"
            fill="#F9F9F9"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M60.7906 92.3185L75.0857 47.5343L81.2057 74.1627L60.7906 92.3185Z"
            fill="#797C7F"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M81.7132 82.7041L81.2108 74.14L60.7272 92.3643L81.7132 82.7041Z"
            fill="#525456"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M63.995 75.7821L63.4468 58.5629L69.9564 54.1554L63.995 75.7821Z"
            fill="#F0F0F0"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M62.0492 62.6071L60.0073 70.4648L62.5926 73.1758L62.0492 62.6071Z"
            fill="#F0F0F0"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M47.7812 114.204V40.8282L60.8462 58.801L47.7812 114.204Z"
            fill="#A2A2A2"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M58.7919 86.3464L51.3914 98.884L54.749 84.6565L58.7919 86.3464Z"
            fill="#9E9E9E"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M57.8038 107.9L56.7988 89.699L52.5048 96.984L57.8038 107.9Z"
            fill="#828282"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M15.2188 37.5166L10.8791 16.1639L16.7035 21.9874L15.2188 37.5166Z"
            fill="#C6C6C6"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M16.6929 21.9897L37.4277 0.202789L10.847 16.0976L16.6929 21.9897Z"
            fill="#A0A0A0"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M6.971 20.8007L10.8539 16.0963L15.2166 37.5175L6.971 20.8007Z"
            fill="#D4D4D4"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M0.232939 60.9019L15.2166 37.4939L6.94816 20.8457L0.232939 60.9019Z"
            fill="#797C7F"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M13.793 82.7108L0.22555 60.9014L4.74804 53.8676L13.793 82.7108Z"
            fill="#797C7F"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M4.75539 53.8448L15.2165 37.4934L16.29 40.7135L4.75539 53.8448Z"
            fill="#C6C6C6"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M13.7914 82.7144L16.2582 40.7399L4.74638 53.8712L13.7914 82.7144Z"
            fill="#A0A0A0"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M20.4252 47.495L16.2453 40.9864L15.0804 60.7404L20.4252 47.495Z"
            fill="#D4D4D4"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M14.3038 74.1466L20.4252 47.4958L15.0804 60.6728L14.3038 74.1466Z"
            fill="#F9F9F9"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M34.7398 92.3043L20.4447 47.5201L14.3247 74.1485L34.7398 92.3043Z"
            fill="#797C7F"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M13.7938 82.6916L14.2961 74.1276L34.7797 92.3518L13.7938 82.6916Z"
            fill="#525456"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M31.5278 75.7698L32.076 58.5507L25.5663 54.1432L31.5278 75.7698Z"
            fill="#F0F0F0"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M33.4734 62.6088L35.5154 70.4665L32.9302 73.1775L33.4734 62.6088Z"
            fill="#F0F0F0"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M47.7415 114.182V40.8062L34.6765 58.779L47.7415 114.182Z"
            fill="#C3C3C3"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M36.7307 86.3223L44.1312 98.8599L40.7736 84.6324L36.7307 86.3223Z"
            fill="#9E9E9E"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M37.7108 107.88L38.7158 89.6791L43.0099 96.9641L37.7108 107.88Z"
            fill="#828282"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M33.9208 57.9461L40.9101 42.12L47.0314 40.2245L33.9208 57.9461Z"
            fill="#D4D4D4"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            d="M61.4327 58.1733L52.4334 36.4552L48.322 40.2233L61.4327 58.1733Z"
            fill="#D4D4D4"
            stroke="#131415"
            strokeWidth="0.045712"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M41.114 41.1819L42.051 34.9927L28.4072 32.7545L37.0003 31.6355L23.9964 26.4054L40.7941 27.2733L38.8058 24.213L46.1876 27.5702L60.2885 28.2325L64.7907 37.9389L59.0315 33.8051L54.7121 33.0743L48.1531 39.058L41.114 41.1819ZM46.4851 31.4957L52.9034 31.861L50.5508 34.0077L46.4851 31.4957Z"
            fill="#BBBBBB"
          />
          <path
            d="M42.051 34.9927L42.0736 34.9961L42.077 34.9738L42.0547 34.9702L42.051 34.9927ZM41.114 41.1819L41.0914 41.1785L41.086 41.2143L41.1206 41.2038L41.114 41.1819ZM28.4072 32.7545L28.4043 32.7319L28.4035 32.7771L28.4072 32.7545ZM37.0003 31.6355L37.0033 31.6581L37.0899 31.6468L37.0088 31.6143L37.0003 31.6355ZM23.9964 26.4054L23.9976 26.3826L23.9879 26.4267L23.9964 26.4054ZM40.7941 27.2733L40.7929 27.2961L40.8377 27.2984L40.8132 27.2609L40.7941 27.2733ZM38.8058 24.213L38.8152 24.1921L38.7439 24.1597L38.7866 24.2254L38.8058 24.213ZM46.1876 27.5702L46.1774 27.5926L46.1865 27.593L46.1876 27.5702ZM60.2885 28.2325L60.3092 28.2229L60.3034 28.2103L60.2896 28.2097L60.2885 28.2325ZM64.7907 37.9389L64.7774 37.9574L64.8481 38.0082L64.8115 37.9293L64.7907 37.9389ZM59.0315 33.8051L59.0464 33.7844L59.0354 33.7826L59.0315 33.8051ZM54.7121 33.0743L54.716 33.0517L54.705 33.0499L54.6967 33.0574L54.7121 33.0743ZM48.1531 39.058L48.1604 39.0822L48.1685 39.0749L48.1531 39.058ZM52.9034 31.861L52.9188 31.8779L52.9589 31.8413L52.9047 31.8382L52.9034 31.861ZM46.4851 31.4957L46.4864 31.4728L46.4731 31.5151L46.4851 31.4957ZM50.5508 34.0077L50.5388 34.0272L50.5535 34.0362L50.5662 34.0246L50.5508 34.0077Z"
            fill="#131415"
          />
        </svg>

        {/* 404 with blur effect */}
        <div className="relative z-10">
          <div className="text-[180px] font-bold opacity-5 select-none  leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[80px] font-bold leading-none">404</div>
          </div>
        </div>

        {/* Error message */}
        <div className="space-y-2 relative z-10">
          <article className="max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
            <br />
            Perhaps you&apos;ve mistyped the URL or the page has been moved.
          </article>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-6 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary hover:bg-primary/90 
                         transition-colors typography-display-labels-medium text-content-presentation-global-primary"
          >
            <i className="ri-home-line mr-2" />
            Return Home
          </Link>
          <Link
            href="/getting-started"
            className="inline-flex items-center px-4 py-2 rounded-md border border-primary/20 
                         hover:border-primary/40 transition-colors typography-display-labels-medium 
                         text-content-presentation-global-primary"
          >
            <i className="ri-book-read-line mr-2" />
            Documentation
          </Link>
        </div>
      </div>
    </div>
  );
}
