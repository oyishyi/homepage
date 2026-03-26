import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const profile = {
  name: "這④硪Dē烘焙雞，小夥伴們快來點踩硪8，暈",
  subtitle: "个人角落 / notes / links / weird internet energy",
  status: "在线，但可能在折腾工具链。",
  mood: "拨号音、荧光渐变、缓存已预热。",
  location: "某个标签很多的桌面",
  email: "not-a-real-email@homepage.local",
  about: [
    "偏爱够用、不臃肿、可控的东西。",
    "喜欢把 AI 放在正确的位置：一边做架构判断，一边做执行提速。",
    "常在工程化、自动化、交互效率、数据一致性这些问题上较真。",
    "对技术史也有兴趣，喜欢去神化、喜欢把事情讲清楚。",
  ],
};

const journalEntries = [
  {
    title: "把 homepage 做得像 90 年代，但别真的回到 90 年代",
    date: "1998.09.14*",
    tag: "ui-log",
    body:
      "我喜欢旧互联网那种很个人、很杂、很不怕土的质感：闪字、边框、像素图标、访客计数器、留言板、友情链接。真正想保留的不是落后的技术，而是那种‘这页就是我’的存在感。",
  },
  {
    title: "工具的理想形态",
    date: "1999.01.03*",
    tag: "dev-notes",
    body:
      "工具应该轻、快、能扩展，而且让我知道它到底在做什么。最好还能自己接管一部分流程：索引、缓存、标签、封面、批处理、自动化。不是越大越好，是越顺手越好。",
  },
  {
    title: "把 AI 当队友，而不是魔法",
    date: "1999.06.22*",
    tag: "ai-workflow",
    body:
      "适合让模型帮忙定结构、拆任务、写脚手架、改很多文件、补测试、推 PR；但方向感、边界感、取舍感，还是要自己把住。最舒服的协作不是全交出去，而是分工明确。",
  },
  {
    title: "关于技术史",
    date: "1997.12.08*",
    tag: "history",
    body:
      "我会被技术史吸引，不是因为传奇叙事，而是因为想知道真正推动变化的是什么：制度、工程、协作、思想，还是被神话过头的个人故事。",
  },
];

const bookmarks = [
  {
    label: "Toolbox",
    items: [
      "React / Vite / Tauri",
      "TypeScript / Rust",
      "SQLite / 缓存 / 索引",
      "ffmpeg / 自动化流水线",
    ],
  },
  {
    label: "偏好关键词",
    items: [
      "轻量实现",
      "大图标视图",
      "Tag chips",
      "可维护的增量更新",
    ],
  },
  {
    label: "internet vibes",
    items: [
      "guestbook culture",
      "web rings",
      "under construction",
      "midi but make it tasteful",
    ],
  },
];

const webring = [
  "自定义封面爱好者联盟",
  "反臃肿工具俱乐部",
  "把 AI 用成队友互助环",
  "技术史去神话同好会",
];

const initialMessages = [
  { name: "visitor_01", text: "这个站有种 CRT 屏幕发热的幸福感。" },
  { name: "cache_queen", text: "轻量、可控、还带点发光边框——很好。" },
  { name: "ring_member", text: "友情链接区很有 90 年代味，但滚动和切换又很丝滑。" },
];

const desktopIcons = [
  { id: "about", label: "about.txt", emoji: "💾" },
  { id: "freegpt", label: "★免费GPT★", emoji: "🤖", blink: true },
  { id: "journal", label: "diary.log", emoji: "📝" },
  { id: "links", label: "bookmarks", emoji: "🌐" },
  { id: "guestbook", label: "guestbook", emoji: "📬" },
  { id: "system", label: "status.exe", emoji: "🖥️" },
];

const windowPresets = {
  about: { title: "about me // profile.sys", w: "max-w-2xl" },
  freegpt: { title: "免费GPT // chat.exe", w: "max-w-5xl" },
  journal: { title: "journal // diary.log", w: "max-w-3xl" },
  links: { title: "links // bookmarks.html", w: "max-w-2xl" },
  guestbook: { title: "guestbook // sign here", w: "max-w-xl" },
  system: { title: "status // status.exe", w: "max-w-lg" },
};

function Counter() {
  const [count, setCount] = useState(90357);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((v) => v + (Math.random() > 0.7 ? 1 : 0));
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono tracking-[0.25em]">{String(count).padStart(6, "0")}</span>;
}

function PixelButton({ children, onClick, active = false, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        "border-2 px-3 py-1 text-[11px] uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,0.6)] transition-transform duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        active
          ? "border-black bg-[#ffeb3b] text-black"
          : "border-black bg-white text-black hover:bg-[#d6f5ff]",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Window({ title, children, onClose, accent = "from-fuchsia-400 via-cyan-300 to-yellow-200", width = "max-w-2xl" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`w-full ${width} border-[3px] border-black bg-[#f4f0e8] shadow-[8px_8px_0_0_rgba(0,0,0,0.75)]`}
    >
      <div className={`flex items-center justify-between border-b-[3px] border-black bg-gradient-to-r ${accent} px-2 py-1`}>
        <div className="truncate pr-3 text-[11px] font-black uppercase tracking-[0.22em] text-black">{title}</div>
        <div className="flex items-center gap-1">
          <span className="grid h-4 w-4 place-items-center border-2 border-black bg-white text-[10px] leading-none">_</span>
          <span className="grid h-4 w-4 place-items-center border-2 border-black bg-white text-[10px] leading-none">□</span>
          <button
            onClick={onClose}
            className="grid h-4 w-4 place-items-center border-2 border-black bg-[#ff6b6b] text-[10px] leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
      <div className="max-h-[70vh] overflow-auto bg-[linear-gradient(to_bottom,rgba(255,255,255,0.55),rgba(255,255,255,0.25))] p-4 text-[#111]">
        {children}
      </div>
    </motion.div>
  );
}

function Blinker({ children }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 700);
    return () => clearInterval(id);
  }, []);
  return <span className={on ? "opacity-100" : "opacity-0"}>{children}</span>;
}

function MarqueeRow({ items }) {
  const full = useMemo(() => [...items, ...items], [items]);
  return (
    <div className="overflow-hidden border-y-2 border-black bg-black py-1 text-[#74ff7a]">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 22 }}
        className="flex min-w-max gap-8 px-4 text-[11px] uppercase tracking-[0.35em]"
      >
        {full.map((item, i) => (
          <span key={`${item}-${i}`}>✦ {item}</span>
        ))}
      </motion.div>
    </div>
  );
}

function FloatingStarfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0.15, scale: 0.8 }}
          animate={{ opacity: [0.15, 0.9, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: s.duration, delay: s.delay }}
          className="absolute text-[10px] text-white/80"
          style={{ left: s.left, top: s.top }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="space-y-4 text-[13px] leading-6">
      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <div className="border-2 border-black bg-[#d9d1ff] p-2">
          <div className="grid h-36 place-items-center border-2 border-dashed border-black bg-[radial-gradient(circle_at_center,#fff_0%,#ffe082_30%,#9fa8da_100%)] text-center text-xs font-bold uppercase tracking-[0.25em]">
            personal<br />avatar<br />placeholder
          </div>
          <div className="mt-2 border-2 border-black bg-white p-2 text-[11px] uppercase leading-5 tracking-[0.18em]">
            mood: {profile.mood}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="inline-block border-2 border-black bg-[#fff176] px-2 py-1 text-[11px] font-black uppercase tracking-[0.25em]">
              about this human.exe
            </div>
          </div>
          <div className="border-2 border-black bg-white p-3">
            <div className="mb-2 text-lg font-black uppercase tracking-[0.2em]">{profile.name}</div>
            <div className="mb-4 text-[11px] uppercase tracking-[0.25em] text-black/70">{profile.subtitle}</div>
            <ul className="space-y-2">
              {profile.about.map((line) => (
                <li key={line} className="flex gap-2">
                  <span>▣</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["status", profile.status],
          ["currently", "在整理界面、打磨工作流、给旧互联网审美续命。"],
          ["contact", profile.email],
        ].map(([k, v]) => (
          <div key={k} className="border-2 border-black bg-white p-3">
            <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ff006e]">{k}</div>
            <div className="text-[13px] leading-6">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JournalPanel() {
  return (
    <div className="space-y-4">
      {journalEntries.map((entry, idx) => (
        <motion.article
          key={entry.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.06 }}
          className="border-2 border-black bg-white p-4"
        >
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
            <span className="border border-black bg-[#c5e1ff] px-2 py-0.5 font-black">{entry.tag}</span>
            <span>{entry.date}</span>
          </div>
          <h3 className="mb-2 text-base font-black uppercase tracking-[0.15em]">{entry.title}</h3>
          <p className="text-[13px] leading-6">{entry.body}</p>
        </motion.article>
      ))}
    </div>
  );
}

function LinksPanel() {
  return (
    <div className="space-y-4 text-[13px] leading-6">
      <div className="grid gap-4 md:grid-cols-3">
        {bookmarks.map((group) => (
          <div key={group.label} className="border-2 border-black bg-white p-3">
            <div className="mb-3 inline-block border-2 border-black bg-[#b2ff59] px-2 py-1 text-[11px] font-black uppercase tracking-[0.22em]">
              {group.label}
            </div>
            <div className="space-y-2">
              {group.items.map((item) => (
                <div key={item} className="border border-black bg-[#fffdf3] px-2 py-1 hover:-translate-y-0.5 transition-transform">
                  ➜ {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-2 border-black bg-white p-4">
        <div className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-[#3f51b5]">web ring</div>
        <div className="grid gap-2 md:grid-cols-2">
          {webring.map((item, i) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 0.4 : -0.4 }}
              className="border-2 border-black bg-[repeating-linear-gradient(45deg,#fff,#fff_8px,#ffe0f0_8px,#ffe0f0_16px)] px-3 py-2 font-semibold"
            >
              ◌ {item}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GuestbookPanel() {
  const [messages, setMessages] = useState(initialMessages);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const formRef = useRef(null);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setMessages((prev) => [{ name: name.trim(), text: text.trim() }, ...prev].slice(0, 8));
    setName("");
    setText("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-4 text-[13px] leading-6" ref={formRef}>
      <form onSubmit={submit} className="space-y-3 border-2 border-black bg-white p-4">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#d500f9]">sign my guestbook</div>
        <div className="grid gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="your handle"
            className="border-2 border-black bg-[#fffef8] px-3 py-2 outline-none placeholder:text-black/40 focus:bg-[#ecfeff]"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="leave a message from your corner of the web..."
            rows={4}
            className="border-2 border-black bg-[#fffef8] px-3 py-2 outline-none placeholder:text-black/40 focus:bg-[#ecfeff]"
          />
          <div>
            <PixelButton type="submit">submit</PixelButton>
          </div>
        </div>
      </form>

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={`${msg.name}-${i}-${msg.text}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-black bg-white p-3"
          >
            <div className="mb-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#009688]">{msg.name}</div>
            <div>{msg.text}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SystemPanel({ soundOn, setSoundOn, crtOn, setCrtOn, theme, setTheme }) {
  const meters = [
    { label: "focus", value: 92 },
    { label: "control", value: 95 },
    { label: "nostalgia", value: 88 },
    { label: "shipping", value: 84 },
  ];

  return (
    <div className="space-y-4 text-[13px]">
      <div className="border-2 border-black bg-white p-3">
        <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#ff5722]">system prefs</div>
        <div className="flex flex-wrap gap-2">
          <PixelButton active={soundOn} onClick={() => setSoundOn((v) => !v)}>
            sound {soundOn ? "on" : "off"}
          </PixelButton>
          <PixelButton active={crtOn} onClick={() => setCrtOn((v) => !v)}>
            crt {crtOn ? "on" : "off"}
          </PixelButton>
          <PixelButton active={theme === "sunset"} onClick={() => setTheme(theme === "sunset" ? "midnight" : "sunset")}>
            theme {theme}
          </PixelButton>
        </div>
      </div>

      <div className="border-2 border-black bg-white p-3">
        <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#3f51b5]">runtime</div>
        <div className="space-y-3">
          {meters.map((m) => (
            <div key={m.label}>
              <div className="mb-1 flex justify-between text-[11px] uppercase tracking-[0.2em]">
                <span>{m.label}</span>
                <span>{m.value}%</span>
              </div>
              <div className="h-4 border-2 border-black bg-[#ddd] p-[1px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full border-r-2 border-black bg-[repeating-linear-gradient(90deg,#00e5ff,#00e5ff_8px,#69f0ae_8px,#69f0ae_16px)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FreeGPTPanel() {
  const FIXED_REPLY = "菜鸟，怎么可能让你用";

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "欢迎使用 免费GPT 。有什么想问的？",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const sendMessage = () => {
    const value = input.trim();
    if (!value || typing) return;

    setMessages((prev) => [...prev, { role: "user", text: value }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: FIXED_REPLY }]);
      setTyping(false);
    }, 500);
  };

  return (
    <div className="flex h-[65vh] flex-col gap-3 text-[13px]">
      <div className="border-2 border-black bg-[#fff59d] px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em]">
        free gpt online
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-auto border-2 border-black bg-white p-3"
      >
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div
              key={`${msg.role}-${i}-${msg.text}`}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={[
                  "max-w-[85%] border-2 border-black px-3 py-2 leading-6",
                  msg.role === "user"
                    ? "bg-[#d6f5ff]"
                    : "bg-[#fffef8]",
                ].join(" ")}
              >
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.15em]">
                  {msg.role === "user" ? "you" : "免费gpt"}
                </div>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="max-w-[85%] border-2 border-black bg-[#fffef8] px-3 py-2 leading-6">
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.15em]">
                  免费gpt
                </div>
                <div>...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-2 border-black bg-white p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={3}
            placeholder="请输入你的问题..."
            className="min-h-[84px] flex-1 resize-none border-2 border-black bg-[#fffef8] px-3 py-2 outline-none placeholder:text-black/40 focus:bg-[#ecfeff]"
          />
          <div className="flex flex-col gap-2">
            <PixelButton onClick={sendMessage} className="h-fit">
              send
            </PixelButton>
            <PixelButton
              onClick={() =>
                setMessages([
                  {
                    role: "assistant",
                    text: "欢迎使用 免费GPT 。有什么想问的？",
                  },
                ])
              }
            >
              clear
            </PixelButton>
          </div>
        </div>

        <div className="mt-2 text-[11px] uppercase tracking-[0.15em] text-black/60">
          fixed response mode enabled
        </div>
      </div>
    </div>
  );
}

export default function RetroHomepageSingleFile() {
  const [booted, setBooted] = useState(false);
  const [theme, setTheme] = useState("sunset");
  const [soundOn, setSoundOn] = useState(false);
  const [crtOn, setCrtOn] = useState(true);
  const [openWindow, setOpenWindow] = useState("about");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const bootTimer = setTimeout(() => setBooted(true), 900);
    const clockTimer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearTimeout(bootTimer);
      clearInterval(clockTimer);
    };
  }, []);

  const bgClass =
    theme === "sunset"
      ? "bg-[radial-gradient(circle_at_top,#fff59d_0%,#ffb56b_18%,#ff6f91_42%,#845ec2_70%,#2c235f_100%)]"
      : "bg-[radial-gradient(circle_at_top,#89f7fe_0%,#66a6ff_18%,#5b4b8a_45%,#2c2b6d_72%,#0f1028_100%)]";

  const renderWindow = () => {
    switch (openWindow) {
      case "journal":
        return <JournalPanel />;
      case "links":
        return <LinksPanel />;
      case "guestbook":
        return <GuestbookPanel />;
      case "system":
        return (
          <SystemPanel
            soundOn={soundOn}
            setSoundOn={setSoundOn}
            crtOn={crtOn}
            setCrtOn={setCrtOn}
            theme={theme}
            setTheme={setTheme}
          />
        );
      case "freegpt":
        return <FreeGPTPanel />;
      case "about":
      default:
        return <AboutPanel />;
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden text-black ${bgClass}`}>
      <FloatingStarfield />

      <AnimatePresence>
        {!booted && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 grid place-items-center bg-black p-6 text-[#67ff76]"
          >
            <div className="w-full max-w-2xl border-2 border-[#67ff76] bg-black p-4 font-mono text-sm leading-7 shadow-[0_0_40px_rgba(103,255,118,0.25)]">
              <div>RetroNet Personal Home Environment v9.6</div>
              <div>Copyright (c) 1998-2001 Somewhere On The Web</div>
              <div className="mt-4">Booting visual nostalgia layer... ok</div>
              <div>Loading profile fragments... ok</div>
              <div>Mounting guestbook... ok</div>
              <div>Synchronizing glitter GIF energy... ok</div>
              <div className="mt-4">Connecting at 56k emotional bandwidth <Blinker>_</Blinker></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-24 pt-6 md:px-6">
        <header className="border-[3px] border-black bg-[#f4f0e8] shadow-[8px_8px_0_0_rgba(0,0,0,0.75)]">
          <div className="border-b-[3px] border-black bg-[repeating-linear-gradient(90deg,#ffffff,#ffffff_14px,#ffd1dc_14px,#ffd1dc_28px,#b3e5fc_28px,#b3e5fc_42px,#fff59d_42px,#fff59d_56px)] px-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xl font-black uppercase tracking-[0.25em] md:text-2xl">{profile.name}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-black/75">
                  <span className="bg-black px-1 text-[#76ff7a]">welcome</span> to Oyishyi's digital bedroom wall
                </div>
              </div>
              <div className="border-2 border-black bg-white px-2 py-1 text-[11px] uppercase tracking-[0.18em]">
                local time // {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
            </div>
          </div>

          <MarqueeRow
            items={[
              "best viewed with curiosity",
              "guestbook open",
              "under permanent construction",
              "90s style / modern feel",
              "small web forever",
            ]}
          />

          <div className="grid gap-4 p-4 lg:grid-cols-[250px_1fr]">
            <aside className="space-y-4">
              <div className="border-2 border-black bg-white p-3">
                <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#ff00a8]">desktop icons</div>
                <div className="grid grid-cols-2 gap-2">
                  {desktopIcons.map((icon) => (
                    <motion.button
                      key={icon.id}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setOpenWindow(icon.id)}
                      className={`border-2 border-black p-3 text-center ${
                        openWindow === icon.id ? "bg-[#d0f0ff]" : "bg-[#fffef8]"
                      }`}
                    >
                      <div className="text-2xl">{icon.emoji}</div>
                      {icon.id === "freegpt" ? (
                        <motion.div
                          animate={{
                            opacity: [1, 0.45, 1],
                            scale: [1, 1.06, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "linear",
                          }}
                          className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#ff1744]"
                        >
                          ★免费GPT★
                        </motion.div>
                      ) : (
                        <div className="mt-2 text-[10px] font-black uppercase tracking-[0.16em]">
                          {icon.label}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="border-2 border-black bg-white p-3 text-[12px] leading-6">
                <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#00bfa5]">site stats</div>
                <div>visitors: <Counter /></div>
                <div>status: <span className="bg-black px-1 text-[#76ff7a]">online</span></div>
                <div>mood: <span className="font-semibold">{profile.mood}</span></div>
                <div>
                  now playing: {soundOn ? "imaginary midi file ♪" : "muted by user preference"}
                </div>
              </div>

              <div className="border-2 border-black bg-white p-3 text-[12px] leading-6">
                <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#3f51b5]">blink zone</div>
                <div className="font-black uppercase tracking-[0.18em] text-[#ff1744]">
                  <Blinker>★ personal website energy restored ★</Blinker>
                </div>
              </div>
            </aside>

            <main className="flex items-start justify-center">
              <AnimatePresence mode="wait">
                <Window
                  key={openWindow}
                  title={windowPresets[openWindow].title}
                  width={windowPresets[openWindow].w}
                  onClose={() => setOpenWindow("about")}
                >
                  {renderWindow()}
                </Window>
              </AnimatePresence>
            </main>
          </div>
        </header>
      </div>

      {crtOn && (
        <div className="pointer-events-none absolute inset-0 z-20 opacity-20 [background:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.15),rgba(255,255,255,0.15)_1px,transparent_1px,transparent_3px)]" />
      )}

      <motion.div
        animate={{ x: [0, 2, -2, 0], y: [0, -1, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.18 }}
        className="pointer-events-none absolute inset-0 z-[15] mix-blend-screen opacity-[0.04]"
      >
        <div className="h-full w-full bg-white" />
      </motion.div>

      <footer className="absolute bottom-0 left-0 right-0 z-30 border-t-[3px] border-black bg-[#f4f0e8] px-4 py-2 text-[11px] uppercase tracking-[0.22em] shadow-[0_-4px_0_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div>© 1999-ish / rebuilt with modern motion</div>
          <div className="flex items-center gap-3">
            <span>best viewed full screen</span>
            <span className="border border-black bg-white px-2 py-0.5">{theme}</span>
            <span className="border border-black bg-white px-2 py-0.5">{crtOn ? "crt:on" : "crt:off"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
