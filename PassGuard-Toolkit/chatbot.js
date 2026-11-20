/**
 * PassGuard Sentinel AI - Live Bilingual Cyber Defense ChatBot
 * Works 100% Client-Side with zero server dependencies.
 * Answers Basic to Advanced Cybersecurity queries in Hindi, English & Hinglish.
 */

(function () {
  // Knowledge Base: Patterns and Responses
  const KNOWLEDGE_BASE = [
    {
      id: "greeting",
      keywords: ["hi", "hello", "hey", "namaste", "pranam", "kese ho", "kaise ho", "kya hal", "kya haal", "halo"],
      reply: `**Namaste! Main Sentinel Cyber AI hoon.** 🤖⚡\n\nAap mujhse cybersecurity, strong passwords, email breach checks ya phishing scams ke baare me koi bhi basic ya advanced question puch sakte hain. \n\n*Aap Hindi, English ya Hinglish kisi me bhi baat kar sakte hain!*`
    },
    {
      id: "who_are_you",
      keywords: ["who are you", "kaun ho", "kon ho", "tera naam", "what do you do", "kya karte ho", "about"],
      reply: `Main **PassGuard Sentinel AI** hoon — ek live client-side cybersecurity assistant! 🛡️\n\nMera kaam hai:\n• Password security & crack time explain karna\n• HIBP email leak check samjhana\n• Phishing emails ke fake links & urgent scams detect karna\n• Advanced cryptography (Argon2, Salted Hashing, 2FA) sikhana!`
    },
    {
      id: "password_tips",
      keywords: ["password strong", "strong password", "password tips", "password kaise banaye", "safe password", "acha password", "good password"],
      reply: `🔑 **Strong Password Banane ke 5 Golden Rules:**\n\n1. **Length matters most:** Kam se kam **14-16 characters** ka password rakhein (Length > Complexity).\n2. **Passphrase use karein:** 3-4 random unassociated words jodein, jaise <span class="cyber-highlight">Blue#Tiger94!Mango</span>.\n3. **Mix characters:** Uppercase, lowercase, numbers aur symbols ka balance rakhein.\n4. **Never reuse:** Har account ka alag password rakhein aur **Password Manager** (Bitwarden/1Password) use karein.\n5. **Personal info avoid karein:** Apna naam, bike number ya DOB kabhi password me na daalein.`
    },
    {
      id: "crack_time",
      keywords: ["crack time", "crack time calculation", "entropy", "kitna time", "time to crack", "brute force time"],
      reply: `⚡ **Password Crack Time kaise calculate hota hai?**\n\nYe **Information Entropy ($H$)** par depend karta hai:\n<div class="cyber-code-box">Entropy = L × log2(N)</div>\n• $L$ = Password ki length\n• $N$ = Character pool size (e.g. 95 for full ASCII)\n\nModern RTX 4090 GPUs 1 second me **100 Billion hashes** guess kar sakti hain! Agar password sirf 8 letters ka hai to <span class="cyber-highlight">kuch minutes</span> me crack ho jayega, par 14+ characters ko crack karne me **lakhon saal** lagte hain.`
    },
    {
      id: "breach_check",
      keywords: ["breach", "email leak", "have i been pwned", "hibp", "data breach", "leak check", "email check", "kya mera email safe"],
      reply: `🚨 **Email Breach ka matlab kya hota hai?**\n\nJab koi website (jaise LinkedIn, Canva, Zomato) hack hoti hai, to unka user database hackers leak kar dete hain.\n\n**PassGuard kaise check karta hai?**\nYe **Have I Been Pwned (HIBP) API** aur **K-Anonymity Model** use karta hai — jisme aapka pura password ya email kabhi expose nahi hota. Agar aapka email breached hai, to turant uska password badlein aur **2FA enable karein**!`
    },
    {
      id: "phishing_basic",
      keywords: ["phishing", "phishing kya hai", "what is phishing", "fake email", "scam email", "fraud email"],
      reply: `🎣 **Phishing Email Pehchanne ke Top Signs:**\n\n1. **Urgency & Threats:** *"Account 24 ghante me suspend ho jayega!"*\n2. **Mismatched Domain:** Sender name PayPal likha hoga par email <span class="cyber-highlight">service@paypa1-security.xyz</span> jaisa hoga.\n3. **Suspicious Attachments:** Invoice ke naam par **.zip, .exe, .scr, .vbs** file bhejna.\n4. **Generic Greetings:** *"Dear Customer"* ya *"Dear User"* likhna bina aapke naam ke.\n5. **Fake Login Links:** Link par hover karke real URL check karein!`
    },
    {
      id: "2fa_mfa",
      keywords: ["2fa", "two factor", "mfa", "authenticator", "otp", "two step", "google authenticator"],
      reply: `🔐 **2FA (Two-Factor Authentication) kyun zaroori hai?**\n\n2FA ka matlab hai **2 layers of defense**:\n1. Something you know (Password)\n2. Something you have (Phone / Authenticator App)\n\n💡 **Pro Security Tip:** SMS OTP se behtar **Authenticator App (TOTP)** (Google Authenticator, Microsoft, Aegis) use karein kyunki SMS OTP **SIM Swapping Attack** se intercept ho sakta hai!`
    },
    {
      id: "hashing_advanced",
      keywords: ["hash", "hashing", "bcrypt", "argon2", "salt", "salted hash", "sha256", "md5"],
      reply: `🛡️ **Advanced: Salted Hashing & Modern Cryptography**\n\n• **Plain Hash vs Salted Hash:** Agar 2 users ka password "123456" hai, to plain MD5 me unka hash identical hoga (Rainbow table vulnerable). **Salt** ek random cryptographically secure string hoti hai jo har password ke sath judti hai.\n\n• **Modern Algorithms:**\n- ❌ **MD5 / SHA-1:** Deprecated & Broken\n- ⚠️ **SHA-256:** Fast for signatures, but too fast for passwords (GPU brute-force vulnerable)\n- ✅ **Argon2id & bcrypt:** Memory-hard algorithms jo GPU/ASIC attacks ko slow kar dete hain.`
    },
    {
      id: "brute_vs_dict",
      keywords: ["brute force", "dictionary attack", "rainbow table", "credential stuffing"],
      reply: `⚔️ **Cyber Attack Types (Advanced):**\n\n1. **Brute Force:** Sabhi possible combinations (a-z, 0-9) try karna. (8 chars tak easy, 14+ par impossible).\n2. **Dictionary Attack:** Common words aur leaked wordlists (jaise RockYou.txt) use karna.\n3. **Credential Stuffing:** Ek breached site se mile email/password ko dusri sites (Amazon, Gmail) par automated bot se try karna.\n4. **Rainbow Table:** Pre-computed hashes ka lookup table.`
    },
    {
      id: "exif_metadata",
      keywords: ["exif", "metadata", "photo location", "image location", "gps photo", "photo details", "camera model", "detective"],
      reply: `📸 **Image EXIF & Metadata Detective:**\n\nJab aap phone ya camera se photo lete hain, to usme hidden EXIF data save hota hai:\n• **GPS Coordinates:** Aapke ghar ya location ke exact latitude/longitude!\n• **Device Specs:** Phone model (iPhone/Samsung), camera aperture & shutter speed.\n• **Timestamp:** Photo click karne ka exact time.\n\n🛡️ **PassGuard EXIF Detective:** Hamare naye **EXIF Detective** tool me image upload karein aur dekhein ki aapki photo me location leak ho rahi hai ya nahi!`
    },
    {
      id: "help",
      keywords: ["help", "madad", "options", "kya pucho", "topics", "features"],
      reply: `Aap mujhse ye sab pooch sakte hain:\n\n• 🛡️ *Strong Password tips & Crack Time*\n• 🚨 *Email data breaches & HIBP API*\n• 🎣 *Phishing email analysis & suspicious links*\n• 📸 *EXIF metadata & photo GPS location leaks*\n• 🔐 *2FA, TOTP & SIM Swap protection*\n• 💻 *Bcrypt, Argon2, Hashing & Salting*\n• ⚡ *Brute-force vs Dictionary attacks*`
    }
  ];

  // Helper to find best matching response
  function findResponse(userInput) {
    const cleanInput = userInput.toLowerCase().trim();

    for (const item of KNOWLEDGE_BASE) {
      for (const kw of item.keywords) {
        if (cleanInput.includes(kw)) {
          return item.reply;
        }
      }
    }

    // Smart contextual fallback
    return `Main aapke is sawaal par cybersecurity point of view se help kar sakta hoon! 🤖\n\nAap chahein to:\n1. **Password Checker** tab me jaakar apna password test karein.\n2. **Breach Check** me email leak dekhein.\n3. **Phishing Analyzer** me raw email scan karein.\n\nYa fir mujhse puchein: *"Password kaise banaye?"* ya *"Phishing kaise pehchane?"*`;
  }

  // Format markdown style bold, italics, code
  function formatMarkdown(text) {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
    return html;
  }

  // Inject Chatbot UI into Page
  function initChatbot() {
    // 1. FAB (Floating Action Button)
    const fab = document.createElement("div");
    fab.className = "passbot-fab";
    fab.id = "passbotFab";
    fab.innerHTML = `
      <div class="bot-avatar">
        <div class="pulse-ring"></div>
        <img src="logo.png" alt="Bot" style="width: 24px; height: 24px; object-fit: contain; filter: drop-shadow(0 0 6px #00F0FF);" />
      </div>
      <div style="display: flex; flex-direction: column;">
        <span style="font-size: 12px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px; display: flex; items-center; gap: 4px;">
          PassBot AI <span style="font-size: 8px; background: rgba(0, 255, 102, 0.2); color: #00FF66; padding: 1px 5px; border-radius: 4px; border: 1px solid rgba(0, 255, 102, 0.4);">LIVE</span>
        </span>
        <span style="font-size: 10px; color: #94A3B8;">Ask Cyber Questions</span>
      </div>
    `;

    // 2. Chat Modal Window
    const modal = document.createElement("div");
    modal.className = "passbot-modal";
    modal.id = "passbotModal";
    modal.innerHTML = `
      <!-- Modal Header -->
      <div style="padding: 14px 18px; background: rgba(13, 19, 34, 0.95); border-bottom: 1px solid rgba(51, 65, 85, 0.7); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; items-center; gap: 10px;">
          <div style="position: relative; width: 34px; height: 34px; border-radius: 10px; background: rgba(0, 240, 255, 0.15); border: 1px solid rgba(0, 240, 255, 0.4); display: flex; align-items: center; justify-content: center;">
            <img src="logo.png" alt="PassBot" style="width: 22px; height: 22px; object-fit: contain;" />
            <span style="position: absolute; bottom: -1px; right: -1px; width: 8px; height: 8px; border-radius: 50%; background: #00FF66; box-shadow: 0 0 6px #00FF66;"></span>
          </div>
          <div>
            <h3 style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin: 0; line-height: 1.2;">PassGuard Sentinel AI</h3>
            <span style="font-size: 10px; color: #38BDF8;">Hindi & English Live Assistant</span>
          </div>
        </div>
        <div style="display: flex; gap: 6px;">
          <button id="passbotCloseBtn" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(51, 65, 85, 0.8); color: #94A3B8; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.2s;">
            ✕
          </button>
        </div>
      </div>

      <!-- Quick Suggestion Bar -->
      <div style="padding: 8px 14px; background: rgba(9, 13, 22, 0.7); border-bottom: 1px solid rgba(30, 41, 59, 0.6); overflow-x: auto; display: flex; gap: 6px; scrollbar-width: none;">
        <button class="passbot-chip" data-prompt="Strong password kaise banayein?">🛡️ Strong Password</button>
        <button class="passbot-chip" data-prompt="Phishing email kaise pehchane?">🎣 Phishing Detection</button>
        <button class="passbot-chip" data-prompt="Email breach check kya hota hai?">🚨 Breach Check</button>
        <button class="passbot-chip" data-prompt="Photo se location aur EXIF data kaise nikalte hain?">📸 EXIF Metadata</button>
        <button class="passbot-chip" data-prompt="2FA aur Authenticator app kyun zaroori hai?">🔐 2FA / OTP</button>
        <button class="passbot-chip" data-prompt="Bcrypt aur Salted Hash kya hota hai?">⚡ Salted Hash (Adv)</button>
      </div>

      <!-- Messages Area -->
      <div class="passbot-messages" id="passbotMessages">
        <div class="passbot-msg bot">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(0, 240, 255, 0.15); border: 1px solid rgba(0, 240, 255, 0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <img src="logo.png" style="width: 18px; height: 18px;" />
          </div>
          <div class="passbot-msg-bubble">
            <strong>Namaste!</strong> Main PassGuard ka live AI Assistant hoon. 🛡️⚡<br/><br/>
            Aap mujhse Hindi ya English me password security, email leaks, ya phishing attacks ke baare me kuch bhi pooch sakte hain!
          </div>
        </div>
      </div>

      <!-- Input Footer Area -->
      <div style="padding: 12px 14px; background: rgba(13, 19, 34, 0.95); border-top: 1px solid rgba(51, 65, 85, 0.7);">
        <form id="passbotForm" style="display: flex; gap: 8px; margin: 0;">
          <input
            id="passbotInput"
            type="text"
            placeholder="Poochhein... (e.g. Phishing kaise pehchane?)"
            style="flex: 1; background: #060911; border: 1px solid rgba(51, 65, 85, 0.9); border-radius: 12px; padding: 10px 14px; font-size: 13px; color: #FFFFFF; outline: none; transition: border-color 0.2s;"
          />
          <button
            type="submit"
            style="background: linear-gradient(135deg, #0284C7, #2563EB); border: 1px solid rgba(56, 189, 248, 0.5); color: #FFFFFF; padding: 0 16px; border-radius: 12px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(2, 132, 199, 0.4);"
          >
            Send ⚡
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(modal);

    // Event Listeners
    const openChat = () => {
      modal.classList.add("active");
      fab.style.display = "none";
      setTimeout(() => document.getElementById("passbotInput")?.focus(), 150);
    };

    const closeChat = () => {
      modal.classList.remove("active");
      fab.style.display = "flex";
    };

    fab.addEventListener("click", openChat);
    document.getElementById("passbotCloseBtn")?.addEventListener("click", closeChat);

    // Form Submit handling
    const form = document.getElementById("passbotForm");
    const input = document.getElementById("passbotInput");
    const msgContainer = document.getElementById("passbotMessages");

    function appendMessage(text, sender) {
      const msgDiv = document.createElement("div");
      msgDiv.className = `passbot-msg ${sender}`;

      if (sender === "bot") {
        msgDiv.innerHTML = `
          <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(0, 240, 255, 0.15); border: 1px solid rgba(0, 240, 255, 0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <img src="logo.png" style="width: 18px; height: 18px;" />
          </div>
          <div class="passbot-msg-bubble">${formatMarkdown(text)}</div>
        `;
      } else {
        msgDiv.innerHTML = `
          <div class="passbot-msg-bubble">${formatMarkdown(text)}</div>
        `;
      }

      msgContainer.appendChild(msgDiv);
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    function showTypingIndicator() {
      const typingDiv = document.createElement("div");
      typingDiv.className = "passbot-msg bot";
      typingDiv.id = "passbotTyping";
      typingDiv.innerHTML = `
        <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(0, 240, 255, 0.15); border: 1px solid rgba(0, 240, 255, 0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <img src="logo.png" style="width: 18px; height: 18px;" />
        </div>
        <div class="passbot-typing">
          <span></span><span></span><span></span>
        </div>
      `;
      msgContainer.appendChild(typingDiv);
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    function removeTypingIndicator() {
      const el = document.getElementById("passbotTyping");
      if (el) el.remove();
    }

    function handleUserInput(query) {
      if (!query.trim()) return;
      appendMessage(query, "user");
      showTypingIndicator();

      // Simulated natural AI response delay
      setTimeout(() => {
        removeTypingIndicator();
        const reply = findResponse(query);
        appendMessage(reply, "bot");
      }, 500);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = "";
      handleUserInput(val);
    });

    // Suggestion chips click
    document.querySelectorAll(".passbot-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const prompt = chip.getAttribute("data-prompt");
        if (prompt) handleUserInput(prompt);
      });
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbot);
  } else {
    initChatbot();
  }
})();
