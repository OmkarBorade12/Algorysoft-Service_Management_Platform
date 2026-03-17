'use client';
import { useState, useRef, useEffect } from 'react';
import {
    FiMessageSquare, FiX, FiSend, FiCreditCard, FiZap,
    FiPhone, FiShoppingBag, FiCode, FiRefreshCw, FiStar,
    FiFileText, FiGlobe, FiPackage, FiShield, FiClock,
} from 'react-icons/fi';
import { TbRobot } from 'react-icons/tb';

interface Message {
    id: number;
    role: 'bot' | 'user';
    text: string;
    html?: string;
}

// ─── Comprehensive intent-based response engine ───────────────────────────
const INTENTS: {
    patterns: RegExp[];
    reply: string;
}[] = [
        // Greetings
        {
            patterns: [/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|howdy|sup|what'?s?\s*up)/i],
            reply: `👋 **Hello! Welcome to AlgorySoft!**\n\nI'm AlgoBot — your 24/7 assistant for all AlgorySoft queries.\n\nHere's what I can help you with:\n• 💰 Pricing & Packages\n• 🚀 Project Delivery Timelines\n• 🛍️ E-Commerce Solutions\n• 🛠️ Post-Delivery Support\n• 📞 Contact & WhatsApp\n• 📄 Invoice & Orders\n\nJust ask me anything! 😊`,
        },

        // Pricing
        {
            patterns: [/price|cost|how much|pricing|package|plan|rate|fee|charge|budget|quote|rupee|₹/i],
            reply: `💰 **AlgorySoft Pricing Guide**\n\n| Package | What's Included | Price |\n|---|---|---|\n| 🌐 Landing Page | 1-page, SEO, Mobile-first | ₹7,999 |\n| 🏢 Business Website | 5-7 pages, Contact form | ₹14,999 |\n| 🛍️ E-Commerce Store | Cart, Payments, Admin panel | ₹24,999 |\n| 📊 SaaS Dashboard | Custom app, User auth, DB | ₹39,999 |\n| 🚀 Enterprise Web App | Full-stack, API, Multi-role | ₹49,999+ |\n\n✅ All prices include: Design, Development, Hosting setup & 1-year FREE support.\n\n👉 Need a custom quote? WhatsApp us: **+91 78995 33525**`,
        },

        // Ecommerce
        {
            patterns: [/ecommerce|e-commerce|online store|shop|woocommerce|shopify|sell online|product listing|cart|checkout|payment integration/i],
            reply: `🛍️ **E-Commerce Solutions by AlgorySoft**\n\n**Starting at ₹24,999**, our e-commerce builds include:\n\n✅ **Full Shopping Experience**\n• Product catalog with filters & search\n• Shopping cart & wishlist\n• Secure checkout (Razorpay / Stripe)\n\n✅ **Admin Dashboard**\n• Product, Order & Customer management\n• Invoice generation & download\n• Analytics & revenue tracking\n\n✅ **Performance & SEO**\n• Mobile-first, lightning fast (90+ Lighthouse score)\n• SEO-optimized product pages\n\n✅ **1-Year FREE support** after delivery\n\n📞 Call/WhatsApp: **+91 78995 33525**`,
        },

        // Delivery / Timeline
        {
            patterns: [/time|how long|delivery|days|week|duration|when|timeline|deadline|eta|turnaround/i],
            reply: `⚡ **Project Delivery Timelines**\n\n| Project Type | Standard | Express |\n|---|---|---|\n| Landing Page | 3–5 days | 1–2 days |\n| Business Website | 7–10 days | 4–5 days |\n| E-Commerce Store | 12–15 days | 7–8 days |\n| SaaS / Web App | 20–30 days | On request |\n\n🚨 **Urgent delivery available** at a small premium — contact us to discuss.\n\n📅 All timelines start from the day we receive your **requirements + content**.\n\n📞 WhatsApp: **+91 78995 33525**`,
        },

        // Support / Maintenance
        {
            patterns: [/support|maintenance|after|warranty|bug|issue|fix|help after|post delivery|revision|change/i],
            reply: `🛠️ **1-Year FREE Support — Included in Every Project**\n\nAfter your project is delivered, we provide:\n\n✅ **Bug fixes** — Any technical issues fixed for free\n✅ **Minor content updates** — Text, images, small changes\n✅ **Performance checks** — Regular health monitoring\n✅ **Guidance & training** — We help you manage your site\n\n📌 **Beyond 1 year:**\n• Monthly maintenance plans from ₹1,499/month\n• On-demand support from ₹499/issue\n\n📞 WhatsApp: **+91 78995 33525** for any support queries.`,
        },

        // Payment
        {
            patterns: [/payment|pay|upi|razorpay|stripe|credit card|debit|emi|bank transfer|net banking|how to pay|invoice|billing/i],
            reply: `💳 **Payment Options at AlgorySoft**\n\n🇮🇳 **Indian Payments:**\n• UPI (PhonePe, GPay, Paytm, BHIM)\n• Net Banking (all major banks)\n• Credit / Debit Cards\n• EMI (6/12 months via Razorpay)\n\n🌍 **International Payments:**\n• Stripe (USD, EUR, GBP)\n• PayPal (on request)\n\n📊 **Milestone-based payment structure:**\n1. 40% advance to start\n2. 30% after design approval\n3. 30% on final delivery\n\n🧾 GST invoices provided for all transactions.\n\n📞 Questions? **+91 78995 33525**`,
        },

        // Contact
        {
            patterns: [/contact|phone|number|whatsapp|call|email|reach|talk|meet|location|office|address/i],
            reply: `📞 **Get in Touch with AlgorySoft**\n\n📱 **Phone / WhatsApp:** +91 78995 33525\n📧 **Email:** algorysoft@gmail.com\n💬 **WhatsApp Direct:** [wa.me/917899533525](https://wa.me/917899533525)\n🌐 **Website:** algorysoft.com\n\n⏰ **Working Hours:** Mon–Sat, 9 AM – 8 PM IST\n⚡ **Response time:** Within 2 hours (usually faster!)\n\n🗓️ **Free consultation call** available — just send us a WhatsApp message!`,
        },

        // Custom project
        {
            patterns: [/custom|specific requirement|unique|special|requirement|my idea|tailored|bespoke|different/i],
            reply: `🎨 **100% Custom-Built Websites — That's Our Promise**\n\nEvery project at AlgorySoft is:\n✅ Built from scratch — no templates\n✅ Designed to match your brand\n✅ Tailored to your business needs\n✅ Scalable for future growth\n\n**Our process:**\n1. 📞 Free consultation call\n2. 📋 Detailed requirements gathering\n3. 🎨 Design mockup (3–5 days)\n4. 💻 Development & testing\n5. 🚀 Deployment + handover\n6. 🛠️ 1-year post-delivery support\n\nShare your idea with us!\n📞 **+91 78995 33525** | ✉️ **algorysoft@gmail.com**`,
        },

        // Refund / Cancellation
        {
            patterns: [/refund|cancel|money back|return|dispute|not happy|unhappy|dissatisfied/i],
            reply: `💼 **AlgorySoft Refund & Cancellation Policy**\n\n**Our milestone-based model protects you:**\n\n| Stage | Refund Eligibility |\n|---|---|\n| Before design starts | 100% refund |\n| After design delivered | 60% refund |\n| During development | 30% refund |\n| After delivery | No refund |\n\n✅ We offer **unlimited revisions** during development to ensure you're 100% satisfied before we close.\n\n📞 If you have any concerns, contact us directly:\n**+91 78995 33525** | algorysoft@gmail.com`,
        },

        // Reviews / Testimonials
        {
            patterns: [/review|testimonial|client|feedback|rating|star|satisfied|happy client|portfolio/i],
            reply: `⭐ **AlgorySoft Client Reviews**\n\n🏆 **4.9/5 average rating** from 200+ verified clients\n\n*"Delivered our e-commerce store in 12 days — exactly what we wanted!"*\n— Rahul M., Mumbai\n\n*"Professional team, responsive support. Our sales increased 40% after the new website!"*\n— Priya S., Bangalore\n\n*"Best investment for our startup. The SaaS dashboard is top-notch."*\n— Arjun K., Hyderabad\n\n🌐 Check all reviews on our homepage or Google Business profile.\n📞 Want to see our portfolio? **+91 78995 33525**`,
        },

        // Invoice / Orders
        {
            patterns: [/invoice|bill|receipt|order|download invoice|gst|tax/i],
            reply: `🧾 **Invoice & Order Management**\n\nAfter placing an order:\n✅ Auto-generated GST invoice available\n✅ Download PDF from your account dashboard\n✅ Order status tracked in real-time\n✅ Email confirmation sent immediately\n\n📋 **To access your invoices:**\n1. Login to your account\n2. Go to **Dashboard > Orders**\n3. Click **Download Invoice** button\n\n❓ Invoice issues? Contact us:\n📞 **+91 78995 33525** | ✉️ algorysoft@gmail.com`,
        },

        // Technologies / Stack
        {
            patterns: [/technology|tech stack|built with|framework|react|next|django|wordpress|node|php|flutter|mobile app|android|ios/i],
            reply: `💻 **Our Technology Stack**\n\n**Frontend:**\n• React.js / Next.js (fast, SEO-friendly)\n• Vue.js / Nuxt.js\n• TypeScript, Tailwind CSS\n\n**Backend:**\n• Django (Python) — secure & scalable\n• Node.js / Express\n• REST APIs & GraphQL\n\n**Databases:**\n• PostgreSQL, MySQL, MongoDB\n\n**Hosting & Infrastructure:**\n• AWS, Google Cloud, Vercel, DigitalOcean\n• SSL certificates, CDN, automated backups\n\n**Mobile (on request):**\n• React Native (Android + iOS)\n\n📞 Ask about specific tech: **+91 78995 33525**`,
        },

        // SEO
        {
            patterns: [/seo|search engine|google rank|ranking|keyword|traffic|organic|visibility|google search/i],
            reply: `🔍 **SEO-First Web Development**\n\nEvery website we build is SEO-optimized from the ground up:\n\n✅ **On-Page SEO:**\n• Meta titles & descriptions\n• Proper heading structure (H1–H6)\n• Image alt-text & lazy loading\n• Schema markup (structured data)\n\n✅ **Technical SEO:**\n• Page speed optimization (90+ Lighthouse)\n• Mobile-first responsive design\n• Clean URLs & sitemap.xml\n• Core Web Vitals compliant\n\n✅ **Content SEO:**\n• Keyword-rich copy writing\n\n📈 Most clients see ranking improvements within 2–3 months!\n\n📞 **+91 78995 33525**`,
        },

        // About AlgorySoft
        {
            patterns: [/about|who are you|what is algory|company|team|founded|background|experience|years/i],
            reply: `🏢 **About AlgorySoft**\n\nAlgorySoft is a **premium web development agency** based in Bangalore, India, specializing in business-grade digital solutions.\n\n📊 **Our Numbers:**\n• 500+ websites delivered\n• 200+ happy clients\n• 4.9/5 average rating\n• 5+ years of experience\n• 15+ expert developers\n\n🎯 **What We Do Best:**\n• Custom business websites\n• E-commerce platforms\n• SaaS dashboards\n• Web applications\n• UI/UX design\n\n💡 **Our Mission:** Help businesses grow online with premium, conversion-optimized web solutions.\n\n📞 **+91 78995 33525** | algorysoft@gmail.com`,
        },

        // Hosting / Domain
        {
            patterns: [/hosting|domain|server|deploy|cpanel|vps|cloud|ssl|certificate|nginx|apache/i],
            reply: `🌐 **Hosting & Domain Services**\n\nWe handle everything end-to-end:\n\n✅ **Domain Registration:** ₹999–₹1,499/year\n✅ **Shared Hosting:** ₹2,499/year (best for small sites)\n✅ **VPS Hosting:** ₹5,999/year (for e-commerce & apps)\n✅ **Cloud Hosting (AWS/GCP):** Custom pricing\n\n🔒 **SSL Certificate:** FREE included with every hosting plan\n\n📋 **We also work with your existing host** — GoDaddy, Hostinger, Namecheap, etc.\n\n🚀 All our hosting comes with:\n• 99.9% uptime guarantee\n• Daily backups\n• CDN integration\n• Free migration\n\n📞 **+91 78995 33525**`,
        },

        // Goodbye / Thanks
        {
            patterns: [/bye|goodbye|see you|thank|thanks|ok|okay|got it|understood|noted|great|awesome|perfect|amazing/i],
            reply: `😊 **You're welcome! Have a great day!**\n\nRemember, I'm here 24/7 if you have more questions.\n\n🚀 **Ready to build your next project?**\n📞 WhatsApp us: **+91 78995 33525**\n📧 Email: **algorysoft@gmail.com**\n\n✨ *AlgorySoft — Where Ideas Go Live!*`,
        },
    ];

function getBotReply(msg: string): string {
    const trimmed = msg.trim();

    // Match intents
    for (const intent of INTENTS) {
        if (intent.patterns.some(p => p.test(trimmed))) {
            return intent.reply;
        }
    }

    // Smart fallback based on keyword scoring
    const lower = trimmed.toLowerCase();
    if (lower.length < 3) return `🤔 Could you elaborate a bit more? I'm here to help with AlgorySoft queries!`;

    return `🤔 **I'm not sure about that specific query.**\n\nHere's what I can help you with:\n• 💰 **Pricing** — type "pricing"\n• ⚡ **Delivery time** — type "how long"\n• 🛍️ **E-Commerce** — type "ecommerce"\n• 📞 **Contact** — type "contact"\n• 🔍 **SEO** — type "seo"\n• 💻 **Tech stack** — type "technology"\n\n📞 For complex queries, WhatsApp us directly at **+91 78995 33525** — we reply within 2 hours!`;
}

// ─── Simple markdown-to-HTML renderer ─────────────────────────────────────
function renderMarkdown(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--dark-pista-bright);text-decoration:underline;">$1</a>')
        .replace(/\n\| (.+)/g, (_, row) => {
            const cells = row.split('|').map((c: string) => `<td style="padding:3px 8px;border:1px solid rgba(255,255,255,0.1)">${c.trim()}</td>`).join('');
            return `<tr>${cells}</tr>`;
        })
        .replace(/(<tr>[\s\S]*?<\/tr>)+/g, (m) => `<table style="border-collapse:collapse;width:100%;margin:6px 0;font-size:0.78rem">${m}</table>`)
        .replace(/\n• /g, '\n<span style="color:var(--dark-pista-bright)">•</span> ')
        .replace(/\n/g, '<br/>');
}

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1, role: 'bot',
            text: `👋 **Hi! I'm AlgoBot** — AlgorySoft's smart assistant.\n\nI can help you with pricing, delivery times, e-commerce solutions, support, and more!\n\nWhat would you like to know? 🚀`,
        },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const msgEnd = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        msgEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    const send = (overrideText?: string) => {
        const text = (overrideText ?? input).trim();
        if (!text) return;
        const userMsg: Message = { id: Date.now(), role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);
        setTimeout(() => {
            const reply = getBotReply(text);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }]);
            setTyping(false);
        }, 700 + Math.random() * 400);
    };

    const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') send(); };

    const clearChat = () => {
        setMessages([{
            id: Date.now(), role: 'bot',
            text: `🔄 Chat cleared! How can I help you today?`,
        }]);
    };

    const QUICK = [
        { icon: <FiCreditCard size={11} />, label: 'Pricing', query: 'pricing' },
        { icon: <FiZap size={11} />, label: 'Delivery', query: 'how long to deliver' },
        { icon: <FiShoppingBag size={11} />, label: 'E-Commerce', query: 'ecommerce' },
        { icon: <FiPhone size={11} />, label: 'Contact', query: 'contact' },
        { icon: <FiCode size={11} />, label: 'Tech Stack', query: 'technology' },
        { icon: <FiStar size={11} />, label: 'Reviews', query: 'reviews' },
        { icon: <FiFileText size={11} />, label: 'Invoice', query: 'invoice' },
        { icon: <FiGlobe size={11} />, label: 'SEO', query: 'seo' },
        { icon: <FiPackage size={11} />, label: 'Custom', query: 'custom project' },
        { icon: <FiShield size={11} />, label: 'Support', query: 'support' },
        { icon: <FiCreditCard size={11} />, label: 'Payment', query: 'payment options' },
        { icon: <FiClock size={11} />, label: 'About Us', query: 'about algorysoft' },
    ];

    return (
        <>
            {/* ── Toggle Button ──────────────────────────────────── */}
            <button
                className="chatbot-toggle"
                onClick={() => setOpen(o => !o)}
                aria-label="Open AlgoBot Chat"
                id="chatbot-toggle-btn"
            >
                {open ? <FiX size={20} /> : <FiMessageSquare size={22} />}
                {!open && <span className="chatbot-notif">1</span>}
            </button>

            {/* ── Chat Window ────────────────────────────────────── */}
            {open && (
                <div className="chatbot-window animate-fadeInUp">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TbRobot size={22} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className="chatbot-name">AlgoBot</div>
                            <div className="chatbot-status" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
                                Online · replies instantly
                            </div>
                        </div>
                        <button
                            onClick={clearChat}
                            title="Clear chat"
                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                            id="chatbot-clear-btn"
                        >
                            <FiRefreshCw size={14} />
                        </button>
                        <button className="chatbot-close" onClick={() => setOpen(false)} id="chatbot-close-btn">
                            <FiX size={16} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map(m => (
                            <div key={m.id} className={`chatbot-msg ${m.role === 'bot' ? 'bot' : 'user'}`}>
                                {m.role === 'bot' && (
                                    <div className="chatbot-msg-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <TbRobot size={16} />
                                    </div>
                                )}
                                <div
                                    className="chatbot-bubble"
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(m.text) }}
                                />
                            </div>
                        ))}
                        {typing && (
                            <div className="chatbot-msg bot">
                                <div className="chatbot-msg-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TbRobot size={16} />
                                </div>
                                <div className="chatbot-bubble chatbot-typing">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}
                        <div ref={msgEnd} />
                    </div>

                    {/* Quick replies — scrollable row */}
                    <div className="chatbot-quick" style={{ flexWrap: 'wrap' }}>
                        {QUICK.map(q => (
                            <button
                                key={q.label}
                                className="chatbot-chip"
                                onClick={() => send(q.query)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                                {q.icon} {q.label}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="chatbot-input-row">
                        <input
                            ref={inputRef}
                            className="chatbot-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Ask me anything about AlgorySoft…"
                            id="chatbot-input"
                        />
                        <button
                            className="chatbot-send"
                            onClick={() => send()}
                            disabled={!input.trim()}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            id="chatbot-send-btn"
                        >
                            <FiSend size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
