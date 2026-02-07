import { useEffect, useRef, useState } from "react";

/* ───────── LOVE MESSAGES ───────── */
const LOVE_MESSAGES = [
    "True Love Found! 💕",
    "Perfect Match Made in Heaven! 💖",
    "Soul Mates United Forever! 💗",
    "Love Blooms Eternal! 🌹",
    "Two Hearts Beat as One! 💞",
    "Forever and Always Together! 💘",
    "Cupid's Perfect Shot! 💝",
    "Meant To Be Together! ✨",
    "Pure Unconditional Love! 💓",
    "Sweet Romance Forever! 💐",
    "Destiny Brought You Together! 🌟",
    "Love Conquers All! ❤️",
    "Eternally Yours! 💕",
    "Hearts Intertwined Forever! 💗",
    "A Love Story Written in Stars! ✨",
    "Together Through Eternity! 💖",
    "The Perfect Valentine! 💝",
    "Love at First Sight! 👀💕",
    "You Complete Each Other! 💞",
    "Infinite Love Connection! ♾️❤️",
    "Romance is in the Air! 🌹",
    "Love's Perfect Harmony! 🎵💕",
    "Two Souls One Heart! 💓",
    "Happily Ever After! 👑💖",
    "Love Beyond Words! 💬💗"
];

/* ───────── ORB CLASS ───────── */
class Orb {
    constructor(x, y, radius, color, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.mass = radius * radius; // Mass proportional to area
        this.trail = [];
        this.maxTrailLength = 30;
        this.glowIntensity = 1;
        this.hasMatched = false; // Track if this heart has found its match
    }

    update(gravity, damping, canvasWidth, canvasHeight) {
        // Apply gravity
        this.vy += gravity;

        // Apply damping (air resistance)
        this.vx *= damping;
        this.vy *= damping;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Add to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Bounce off walls with energy loss
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx = -this.vx * 0.8;
            this.createBounceEffect();
        }
        if (this.x + this.radius > canvasWidth) {
            this.x = canvasWidth - this.radius;
            this.vx = -this.vx * 0.8;
            this.createBounceEffect();
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy = -this.vy * 0.8;
            this.createBounceEffect();
        }
        if (this.y + this.radius > canvasHeight) {
            this.y = canvasHeight - this.radius;
            this.vy = -this.vy * 0.8;
            this.createBounceEffect();
        }

        // Decay glow
        this.glowIntensity = Math.max(0.3, this.glowIntensity * 0.99);
    }

    createBounceEffect() {
        this.glowIntensity = 1.5;
    }

    draw(ctx) {
        // Draw trail
        if (this.trail.length > 1) {
            ctx.save();
            for (let i = 1; i < this.trail.length; i++) {
                const alpha = (i / this.trail.length) * 0.4;
                const width = (i / this.trail.length) * this.radius * 0.3;

                ctx.strokeStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
                ctx.lineWidth = width;
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
                ctx.stroke();
            }
            ctx.restore();
        }

        // Draw heart with multi-layer glow
        ctx.save();

        // Outer glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2.5);
        gradient.addColorStop(0, this.color.replace('rgb', 'rgba').replace(')', ', 0.5)'));
        gradient.addColorStop(0.5, this.color.replace('rgb', 'rgba').replace(')', ', 0.2)'));
        gradient.addColorStop(1, this.color.replace('rgb', 'rgba').replace(')', ', 0)'));

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.radius * 2.5, this.y - this.radius * 2.5, this.radius * 5, this.radius * 5);

        // Main heart with glow
        ctx.shadowBlur = 25 * this.glowIntensity;
        ctx.shadowColor = this.color;

        // Create gradient for heart
        const heartGradient = ctx.createRadialGradient(
            this.x - this.radius * 0.2,
            this.y - this.radius * 0.3,
            this.radius * 0.1,
            this.x,
            this.y,
            this.radius * 1.5
        );
        heartGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        heartGradient.addColorStop(0.3, this.color);
        heartGradient.addColorStop(1, this.color.replace('rgb', 'rgba').replace(')', ', 0.8)'));

        ctx.fillStyle = heartGradient;

        // Draw heart shape
        ctx.translate(this.x, this.y);
        ctx.scale(this.radius / 20, this.radius / 20);
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.bezierCurveTo(-10, -20, -25, -10, -25, 5);
        ctx.bezierCurveTo(-25, 15, -15, 25, 0, 35);
        ctx.bezierCurveTo(15, 25, 25, 15, 25, 5);
        ctx.bezierCurveTo(25, -10, 10, -20, 0, -5);
        ctx.fill();

        // Highlight on heart
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-8, -8, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Check collision with another orb
    checkCollision(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.radius + other.radius;
    }

    // Resolve collision with another orb (elastic collision)
    resolveCollision(other, onSameColorCollision) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return; // Prevent division by zero

        // Check if same color collision (only trigger message if neither has matched yet)
        const isSameColor = this.color === other.color;
        if (isSameColor && onSameColorCollision && !this.hasMatched && !other.hasMatched) {
            const midX = (this.x + other.x) / 2;
            const midY = (this.y + other.y) / 2;
            onSameColorCollision(midX, midY, this.color);

            // Mark both hearts as matched
            this.hasMatched = true;
            other.hasMatched = true;
        }

        // Normalize collision vector
        const nx = dx / distance;
        const ny = dy / distance;

        // Relative velocity
        const dvx = other.vx - this.vx;
        const dvy = other.vy - this.vy;

        // Relative velocity in collision normal direction
        const dvn = dvx * nx + dvy * ny;

        // Do not resolve if velocities are separating
        if (dvn > 0) return;

        // Collision impulse
        const impulse = (2 * dvn) / (this.mass + other.mass);

        // Update velocities
        this.vx += impulse * other.mass * nx;
        this.vy += impulse * other.mass * ny;
        other.vx -= impulse * this.mass * nx;
        other.vy -= impulse * this.mass * ny;

        // Separate overlapping orbs
        const overlap = (this.radius + other.radius - distance) / 2;
        this.x -= overlap * nx;
        this.y -= overlap * ny;
        other.x += overlap * nx;
        other.y += overlap * ny;

        // Boost glow on collision
        this.glowIntensity = isSameColor ? 2.5 : 1.5;
        other.glowIntensity = isSameColor ? 2.5 : 1.5;
    }
}

/* ───────── SPARKLE PARTICLE ───────── */
class Sparkle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.size = Math.random() * 3 + 1;
        this.alpha = 1;
        this.color = color;
        this.life = 60;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.016;
        this.life--;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

/* ───────── LOVE MESSAGE PARTICLE ───────── */
class LoveMessage {
    constructor(x, y, message, color) {
        this.x = x;
        this.y = y;
        this.message = message;
        this.color = color;
        this.alpha = 1;
        this.vy = -1.5; // Float upward
        this.life = 120;
        this.scale = 0;
    }

    update() {
        this.y += this.vy;
        this.life--;

        // Scale in animation
        if (this.scale < 1) {
            this.scale += 0.1;
        }

        // Fade out in last 30 frames
        if (this.life < 30) {
            this.alpha = this.life / 30;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        // Shadow for text - very dark for maximum visibility
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#8b1538';

        // Draw message in very dark rose/wine color
        ctx.fillStyle = '#8b1538';
        ctx.font = `bold ${20 * this.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(this.message, this.x, this.y);

        // White outline for extra contrast
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.strokeText(this.message, this.x, this.y);

        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

/* ───────── COLOR PALETTE ───────── */
const COLORS = [
    'rgb(255, 77, 109)',    // Hot Pink
    'rgb(255, 105, 135)',   // Light Pink
    'rgb(255, 51, 102)',    // Rose
    'rgb(200, 87, 255)',    // Purple
    'rgb(255, 102, 178)',   // Magenta
    'rgb(220, 60, 120)',    // Deep Rose
    'rgb(255, 140, 180)',   // Soft Pink
];

/* ───────── MAIN COMPONENT ───────── */
export default function GravityPlayground() {
    const canvasRef = useRef(null);
    const orbsRef = useRef([]);
    const sparklesRef = useRef([]);
    const loveMessagesRef = useRef([]);
    const animationIdRef = useRef(null);
    const [orbCount, setOrbCount] = useState(0);
    const [gravity, setGravity] = useState(0.5);
    const [matchCount, setMatchCount] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        // Animation loop
        const animate = () => {
            // Clear with fade effect for trails
            ctx.fillStyle = 'rgba(255, 240, 245, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw orbs
            orbsRef.current.forEach(orb => {
                orb.update(gravity, 0.995, canvas.width, canvas.height);
                orb.draw(ctx);
            });

            // Check collisions between orbs
            for (let i = 0; i < orbsRef.current.length; i++) {
                for (let j = i + 1; j < orbsRef.current.length; j++) {
                    if (orbsRef.current[i].checkCollision(orbsRef.current[j])) {
                        orbsRef.current[i].resolveCollision(
                            orbsRef.current[j],
                            (x, y, color) => {
                                // Create love message
                                const message = LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)];
                                loveMessagesRef.current.push(new LoveMessage(x, y, message, color));
                                setMatchCount(prev => prev + 1);

                                // Extra sparkles for same-color collision
                                for (let k = 0; k < 30; k++) {
                                    sparklesRef.current.push(new Sparkle(x, y, color));
                                }
                            }
                        );
                    }
                }
            }

            // Update and draw sparkles
            sparklesRef.current = sparklesRef.current.filter(s => !s.isDead());
            sparklesRef.current.forEach(sparkle => {
                sparkle.update();
                sparkle.draw(ctx);
            });

            // Update and draw love messages
            loveMessagesRef.current = loveMessagesRef.current.filter(m => !m.isDead());
            loveMessagesRef.current.forEach(message => {
                message.update();
                message.draw(ctx);
            });

            animationIdRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Click handler - spawn orb
        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const radius = Math.random() * 20 + 15;
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];

            // Random initial velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            const orb = new Orb(x, y, radius, color, vx, vy);
            orbsRef.current.push(orb);
            setOrbCount(orbsRef.current.length);

            // Create spawn sparkles
            for (let i = 0; i < 20; i++) {
                sparklesRef.current.push(new Sparkle(x, y, color));
            }
        };

        canvas.addEventListener('click', handleClick);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationIdRef.current);
            window.removeEventListener('resize', setCanvasSize);
            canvas.removeEventListener('click', handleClick);
        };
    }, [gravity]);

    const clearOrbs = () => {
        orbsRef.current = [];
        setOrbCount(0);
        setMatchCount(0);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #ffe0f0 0%, #ffd6e8 25%, #ffe5f5 50%, #ffc9e0 75%, #fff0f8 100%)',
                }}
            />

            {/* UI Controls */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                color: '#c41e5e',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                background: 'rgba(255, 255, 255, 0.85)',
                padding: '20px',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(196, 30, 94, 0.2)',
            }}>
                <h1 style={{
                    margin: '0 0 15px 0',
                    fontSize: '24px',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #ff4d6d 0%, #ff69b4 50%, #ff1493 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    💖 Love Gravity 💕
                </h1>

                <p style={{ margin: '0 0 15px 0', fontSize: '14px', opacity: 0.7, color: '#d63384' }}>
                    Click anywhere to create hearts 💗
                </p>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '13px', display: 'block', marginBottom: '8px', opacity: 0.85, color: '#c41e5e' }}>
                        Hearts: <strong>{orbCount}</strong> ❤️
                    </label>
                    <label style={{ fontSize: '13px', display: 'block', marginBottom: '8px', opacity: 0.85, color: '#c41e5e' }}>
                        Love Matches: <strong>{matchCount}</strong> 💕
                    </label>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '13px', display: 'block', marginBottom: '8px', opacity: 0.85, color: '#c41e5e' }}>
                        Gravity: <strong>{gravity.toFixed(2)}</strong>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={gravity}
                        onChange={(e) => setGravity(parseFloat(e.target.value))}
                        style={{
                            width: '100%',
                            cursor: 'pointer',
                        }}
                    />
                </div>

                <button
                    onClick={clearOrbs}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: 'linear-gradient(135deg, #ff4d6d 0%, #ff7a8a 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Clear All Hearts 💔
                </button>

                <div style={{ marginTop: '15px', fontSize: '12px', opacity: 0.65, lineHeight: '1.5', color: '#d63384' }}>
                    💝 Hearts fall with love<br />
                    💞 They bounce and collide<br />
                    ✨ Watch the romantic trails<br />
                    💘 Happy Valentine's Day!
                </div>
            </div>
        </div>
    );
}
