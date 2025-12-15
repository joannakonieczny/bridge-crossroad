const emailHeader = `
  <div style="display: flex; align-items: center; margin-bottom: 30px;">
    <svg width="80" height="74" viewBox="0 0 131 122" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 20px;">
      <g clip-path="url(#clip0_198_5996)">
        <path d="M5.70496 18.496C5.70496 18.496 105.318 47.6039 96.4128 105.775C95.3523 112.702 118.251 99.2205 118.251 99.2205C118.251 99.2205 116.057 33.9356 19.8681 7.63611" fill="#553C9A"/>
        <path d="M98.9929 94.2232C98.9929 94.2232 85.5874 96.028 85.0585 95.7687C82.651 94.5884 105.583 118.697 108.007 119.688C108.62 119.939 127.247 83.2261 128.712 81.7655C131.54 78.9471 113.666 90.0828 113.666 90.0828L98.9929 94.2232Z" fill="#553C9A"/>
        <path d="M9.06348 15.9053C9.06348 15.9053 108.676 45.0132 99.7713 103.184C98.7109 110.111 121.609 96.6298 121.609 96.6298C121.609 96.6298 119.416 31.3449 23.2267 5.04541" fill="#9F7AEA"/>
        <path d="M128.986 81.3251L131 83.7185L125.612 87.0499L125.117 86.2123L128.986 81.3251Z" fill="#553C9A"/>
        <path d="M100.971 96.5337C100.971 96.5337 87.5656 98.3385 87.0367 98.0792C84.6292 96.8989 107.561 121.007 109.986 121.999C110.598 122.249 129.279 84.9176 130.995 83.7206C131.159 83.606 115.644 92.3933 115.644 92.3933L100.971 96.5337Z" fill="#9F7AEA"/>
        <path d="M89.1666 1.0321L110.409 9.39352C110.409 9.39352 22.4127 44.8212 37.5622 95.9098C39.6394 102.915 13.7644 88.9627 13.7644 88.9627C13.7644 88.9627 11.3492 32.073 89.1666 1.0321Z" fill="#FFD700"/>
        <path d="M87.3078 0L107.943 8.40945C107.943 8.40945 15.9217 46.0394 34.4717 96.1314C36.9929 102.94 9.82437 87.9306 9.82437 87.9306C9.82437 87.9306 9.49036 31.0409 87.3078 0Z" fill="#F0E68C"/>
        <path d="M3.39819 83.1112L47.5572 94.5063C47.5572 94.5063 15.2629 118.151 15.1545 117.84C12.9347 111.471 4.66193 85.5412 3.39819 83.1112Z" fill="#FFD700"/>
        <path d="M92.462 13.7594L81.3416 11.016L78.2971 4.74805L88.3404 6.80931L92.462 13.7594Z" fill="#DAA520"/>
        <path d="M0 82.2288L44.159 93.6238C44.159 93.6238 14.6183 116.246 14.5098 115.935C12.2901 109.566 1.26373 84.6587 0 82.2288Z" fill="#F0E68C"/>
        <path d="M110.292 66.5345L111.7 69.3003L100.694 76.2846L102.183 79.885L99.9185 81.6373C99.9185 81.6373 98.2992 75.2896 97.5217 74.543" fill="#553C9A"/>
        <path d="M111.437 68.6503L109.449 64.6339L105.008 64.3698L107.383 68.7526L99.8491 74.2502L97.4217 69.176L95.0426 70.796L99.9237 81.6223L100.264 72.772L111.437 68.6503Z" fill="#553C9A"/>
        <path d="M101.028 84.8131L101.964 89.0298L105.409 87.5615C105.409 87.5615 105.956 93.54 109.036 91.1583C112.116 88.7766 116.267 81.0808 116.933 81.0417C117.599 81.0027 99.3479 74.9834 103.469 82.7532C105.529 86.6381 106.876 83.4465 105.633 83.1683C104.389 82.8901 100.903 84.5202 100.903 84.5202L101.028 84.8131Z" fill="#553C9A"/>
        <path d="M76.8862 22.928C76.8862 22.928 86.7433 17.1768 86.7218 17.0773C86.7092 17.0187 83.7373 15.2572 83.7373 15.2572L74.0558 20.8196L76.8862 22.928Z" fill="#DAA520"/>
        <path d="M74.1322 20.7761C74.1322 20.7761 75.0026 7.40934 67.0096 16.1942C66.9578 16.2512 64.7332 14.4521 64.7332 14.4521C64.7332 14.4521 68.3318 8.9056 73.5091 10.6477C77.4284 11.9666 77.2419 19.4478 77.2419 19.4478L74.1322 20.7761Z" fill="#DAA520"/>
      </g>
      <defs>
        <clipPath id="clip0_198_5996">
          <rect width="131" height="122" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    <h1 style="margin: 0; font-size: 32px; color: black; font-weight: bold;">Bridge Crossroad</h1>
  </div>
`;

export const forgetPasswordTemplate = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f5; }
        .container { max-width: 600px; margin: 20px auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .password-box { background-color: #f0f0f0; border: 2px solid #a855f7; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .password-text { font-size: 24px; font-weight: bold; color: #a855f7; letter-spacing: 2px; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="container">
        ${emailHeader}
        <p>Cześć,</p>
        <p>Otrzymaliśmy prośbę o resetowanie hasła do Twojego konta. Oto Twoje nowe hasło tymczasowe:</p>
        <div class="password-box">
          <div class="password-text">[[TEMPORARY_PASSWORD]]</div>
        </div>
        <p>Użyj tego hasła do zalogowania się, a następnie zmień je na nowe w ustawieniach konta.</p>
        <p>Jeśli to nie Ty zażądałeś resetowania hasła, natychmiast skontaktuj się z nami.</p>
        <p>Pozdrawiamy,<br>Zespół Bridge Crossroad</p>
      </div>
    </body>
  </html>
`;

export const playerIntrestedTemplate = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f5; }
        .container { max-width: 600px; margin: 20px auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      </style>
    </head>
    <body>
      <div class="container">
        ${emailHeader}
        <p>Cześć,</p>
        <p>Gracz <strong>[[PLAYER_NAME]]</strong> wyraził zainteresowanie zagraniem z Tobą.</p>
        <p>Dane gracza:</p>
        <ul>
          <li>Email: [[PLAYER_EMAIL]]</li>
          <li>Poziom: [[PLAYER_LEVEL]]</li>
        </ul>
        <p>Pozdrawiamy,<br>Zespół Bridge Crossroad</p>
      </div>
    </body>
  </html>
`;

export const playerAgreedTemplate = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f5; }
        .container { max-width: 600px; margin: 20px auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      </style>
    </head>
    <body>
      <div class="container">
        ${emailHeader}
        <p>Cześć,</p>
        <p>Świetna wiadomość! Gracz <strong>[[PLAYER_NAME]]</strong> zaakceptował prośbę o partnerstwo.</p>
        <p>Dane gracza:</p>
        <ul>
          <li>Email: [[PLAYER_EMAIL]]</li>
          <li>Data akceptacji: [[ACCEPTANCE_DATE]]</li>
        </ul>
        <p><a href="[[TOURNAMENT_LINK]]" style="display: inline-block; background-color: #a855f7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Przejdź do turnieju</a></p>
        <p>Pozdrawiamy,<br>Zespół Bridge Crossroad</p>
      </div>
    </body>
  </html>
`;
