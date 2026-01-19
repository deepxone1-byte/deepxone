import bcrypt from 'bcryptjs';
import pool from '../config/database';
import logger from '../config/logger';

async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');

    const connection = await pool.getConnection();

    try {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      const [adminResult] = await connection.query(
        `INSERT INTO users (email, password, username, full_name, role, bio, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
        [
          'admin@test.com',
          adminPassword,
          'admin',
          'System Administrator',
          'admin',
          'Platform administrator managing the Art of Karen community.',
          true
        ]
      );
      const adminId = (adminResult as any).insertId;
      logger.info('✅ Admin user created: admin@test.com / admin123');

      // Create sample artist
      const artistPassword = await bcrypt.hash('artist123', 10);
      const [artistResult] = await connection.query(
        `INSERT INTO users (email, password, username, full_name, role, bio, website, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
        [
          'artist@test.com',
          artistPassword,
          'karen',
          'Karen Duplisea',
          'artist',
          'Professional oil painter and digital artist with 15+ years of experience. I specialize in portraits and landscapes, blending traditional techniques with modern digital tools. Passionate about teaching and sharing my creative journey with aspiring artists.',
          'https://karenart.com',
          true
        ]
      );
      const artistId = (artistResult as any).insertId;
      logger.info('✅ Artist user created: artist@test.com / artist123');

      // Create sample student
      const studentPassword = await bcrypt.hash('student123', 10);
      await connection.query(
        `INSERT INTO users (email, password, username, full_name, role, bio, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE email=email`,
        [
          'student@test.com',
          studentPassword,
          'student1',
          'Jane Student',
          'student',
          'Aspiring artist learning from the masters. Focused on developing my portrait skills.',
          true
        ]
      );
      logger.info('✅ Student user created: student@test.com / student123');

      // Create sample blog post 1
      const blogSlug1 = `my-journey-from-traditional-to-digital-art-${Date.now()}`;
      const [blogResult1] = await connection.query(
        `INSERT INTO blog_posts (user_id, title, slug, content, excerpt, is_published, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          artistId,
          'My Journey from Traditional to Digital Art',
          blogSlug1,
          `When I first started painting over 15 years ago, the idea of creating art on a computer seemed almost sacrilegious. I was trained in classical oil painting techniques, spending hours mixing colors on my palette and layering brushstrokes on canvas. The smell of linseed oil and turpentine was as much a part of my creative process as the art itself.

But everything changed when I reluctantly picked up a digital tablet for the first time.

## The Resistance

Like many traditional artists, I resisted digital art for years. I had all the typical concerns:
- "It's not real art"
- "There's no soul in pixels"
- "Anyone can just undo mistakes"
- "The physicality of painting is essential"

Looking back, I realize I was afraid. Afraid of learning something new, afraid of losing my identity as a "traditional" artist, and afraid that digital tools might somehow diminish the value of my years of practice.

## The Turning Point

The breakthrough came during a commission that had an impossibly tight deadline. A client needed three different concept variations of a portrait, and they needed them within 48 hours. In traditional media, this would have been nearly impossible – each variation would require a separate canvas and hours of drying time between layers.

Desperate, I borrowed a friend's Wacom tablet and gave Photoshop a try.

What happened next surprised me. Within those 48 hours, I not only delivered three variations – I delivered seven. The ability to duplicate layers, try different color schemes, and experiment without fear of "ruining" the piece was liberating in a way I hadn't expected.

## Finding the Balance

Here's what I've learned after five years of working in both mediums:

**Digital art didn't replace my traditional skills – it enhanced them.**

The color theory I learned mixing oils? Essential for choosing digital palettes.
The composition skills from sketching? Just as crucial on a tablet.
The understanding of light and form? Irreplaceable, regardless of medium.

Digital tools are exactly that – tools. They're brushes with infinite colors, canvases that never run out, and erasers that don't damage the surface. But they still require an artist's eye, hand, and heart.

## My Current Workflow

Today, I work seamlessly between both worlds:

1. **Sketching**: I still prefer pencil on paper for initial concepts
2. **Digital refinement**: Scan and refine the composition in Procreate
3. **Color studies**: Quick digital color variations to choose the palette
4. **Final piece**: Depending on the project, either digital completion or traditional painting

## Advice for Traditional Artists

If you're a traditional artist curious about digital:

**Start small.** You don't need a $2000 Cintiq. A basic tablet and free software like Krita can get you started.

**Embrace the learning curve.** Yes, it feels weird at first. Your hand-eye coordination needs time to adjust. Give yourself that time.

**Don't abandon your roots.** Your traditional training is your superpower. Digital tools can't teach you how to see light, understand anatomy, or create compelling compositions.

**Experiment without pressure.** Digital art is perfect for experimentation because mistakes cost nothing but time.

## The Best of Both Worlds

The most exciting part of my journey has been discovering that traditional and digital art aren't competing – they're complementary. I can sketch an idea digitally, paint it traditionally, scan it, and add digital enhancements. Or start with a digital painting and recreate it in oils with the confidence that comes from already solving all the compositional problems.

My advice? Don't let fear or snobbery keep you from exploring new tools. Every medium has something unique to offer, and being fluent in multiple mediums makes you a more versatile and employable artist.

The art world is evolving, and that's exciting! Whether you paint with oils, acrylics, pixels, or all of the above – what matters is that you're creating.

What's your experience with traditional vs digital art? I'd love to hear your thoughts in the comments below!

---

*Karen Duplisea is a professional artist specializing in portraits and landscapes. She teaches workshops on bridging traditional and digital art techniques. Follow her journey on Instagram @karenartist*`,
          'After 15 years of traditional oil painting, I finally picked up a digital tablet. Here\'s what happened and what I learned about bridging the gap between traditional and digital art.',
          true,
          new Date()
        ]
      );
      logger.info('✅ Blog post 1 created: My Journey from Traditional to Digital Art');

      // Create sample blog post 2
      const blogSlug2 = `5-mistakes-beginner-portrait-artists-make-${Date.now()}`;
      const [blogResult2] = await connection.query(
        `INSERT INTO blog_posts (user_id, title, slug, content, excerpt, is_published, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          artistId,
          '5 Mistakes Every Beginner Portrait Artist Makes (And How to Fix Them)',
          blogSlug2,
          `I've been teaching portrait painting for over a decade, and I see the same mistakes repeated by nearly every beginner. The good news? These are all easily fixable once you know what to look for. Let me save you years of frustration by sharing the five most common portrait mistakes and exactly how to correct them.

## Mistake #1: Starting with Details Too Early

**The Problem:**
New artists often start by carefully rendering one eye, making it absolutely perfect... and then everything else looks wrong in comparison. They're so focused on making each individual feature beautiful that they forget about the bigger picture.

**Why It Happens:**
Details are satisfying! There's instant gratification in rendering a realistic eye or nose. But portraits are about relationships – how the features work together, not how perfect each one is in isolation.

**The Fix:**
Start with shapes, not features. Block in the entire head using simple geometric shapes. Establish:
- Overall head shape (oval, square, etc.)
- Placement of features (eyes, nose, mouth)
- Shadow patterns (where is the light coming from?)

Only once these relationships are correct should you start refining details. I tell my students: "Go from general to specific, always."

**Exercise:**
Set a timer for 30 minutes. Spend the first 20 minutes ONLY on proportions and values. No details allowed. Use the last 10 minutes for refinement. You'll be shocked at how much stronger your portraits become.

## Mistake #2: Making Everything Too Dark

**The Problem:**
Beginner portraits often look muddy and lack life. Every shadow is pure black, every highlight is barely visible, and the overall image looks dull and heavy.

**Why It Happens:**
Fear! Artists are afraid their portrait won't look "realistic" enough, so they push the darks too hard, thinking it will create more dimension. But reality is actually much lighter than we think.

**The Fix:**
Squint at your reference photo. Really squint! Notice how many of those "dark" areas are actually mid-tones? Your darkest dark should be reserved for the pupil, nostril, and maybe the cast shadow under the chin. That's it.

Use this value scale approach:
- Lightest lights: 1-2% of your portrait (highlights)
- Light tones: 20-30% (lit areas)
- Mid-tones: 40-50% (transition zones)
- Dark tones: 20-25% (shadow areas)
- Darkest darks: 1-2% (core shadows, pupils)

**Pro Tip:**
Mix your darks with color! Instead of black for shadows, use dark purples, deep blues, or warm browns. This creates much more life and dimension.

## Mistake #3: Ignoring the Skull Underneath

**The Problem:**
Portraits that look "flat" or where features seem to float on the face instead of being anchored in a three-dimensional structure.

**Why It Happens:**
We draw what we think we see (eyes, nose, mouth) instead of understanding what's actually there (a skull with flesh stretched over it).

**The Fix:**
Study skull anatomy. I know, I know – it sounds intimidating. But you don't need to memorize every bone. Just understand:

Key landmarks to know:
- Brow ridge: Creates the shadow over the eyes
- Cheekbones: Create the plane change on the face
- Jaw: Defines the lower structure
- Eye sockets: Eyes sit IN the head, not on it
- Nasal bone: The nose projects out from the face

**Exercise:**
Before painting your next portrait, sketch the skull underneath. Seriously. A simple skull sketch showing where the bones are. Then overlay your portrait on top. Watch how much more solid and three-dimensional your work becomes.

## Mistake #4: Same Value for Everything (No Contrast)

**The Problem:**
Everything in the portrait is rendered with equal importance – the eyelashes get the same attention as the focal point, background elements compete with the face, and nothing stands out.

**Why It Happens:**
We see everything equally when we look at a reference photo, so we paint everything equally. But art isn't about copying – it's about directing the viewer's attention.

**The Fix:**
Create a focal point (usually the eyes) and use contrast to guide attention there:

**Maximum contrast = Maximum attention**

At your focal point (eyes):
- Sharpest edges
- Highest contrast between light and dark
- Most detail and refinement

Moving away from focal point:
- Softer edges
- Less contrast
- Less detail

**The Test:**
Stand back 6 feet from your portrait. Where does your eye go first? If it's not the eyes, you need to increase contrast there and reduce it everywhere else.

## Mistake #5: Overworking the Portrait

**The Problem:**
The portrait looked great 2 hours ago, but you kept working on it, and now it looks tight, overworked, and lifeless. You've rendered every single pore and hair, but somehow lost the energy of the piece.

**Why It Happens:**
Lack of confidence! We don't trust that the portrait is "done," so we keep adding more and more detail, thinking more work = better art.

**The Fix:**
Learn to recognize when to stop. Here are my rules:

**Stop when:**
- You've achieved your focal point (sharp, detailed eyes)
- The proportions are correct
- The values describe the form
- The edges vary (some sharp, some soft)
- There's a sense of life and energy

**Keep going if:**
- Major proportions are off
- The face looks flat (no form)
- Everything is the same value
- You can't tell where the light is coming from

**Pro Technique:**
Work in layers and take photos after each session. Often, your "best" version was 2-3 hours ago. Don't be afraid to go back to an earlier state if you've overworked it.

## Bonus: The 80/20 Rule

Here's something that changed my art forever:

**80% of the impact comes from 20% of the work**

That first 20% where you nail the proportions, establish values, and create a strong design? That's what makes or breaks your portrait.

The remaining 80% of time you spend is refinement, and while it matters, it will never save a portrait with weak foundations.

**Spend your energy on:**
- Correct proportions (measure, measure, measure!)
- Strong value structure (squint constantly!)
- Good composition (where is the head placed?)
- Facial anatomy (understand the skull)

**Don't waste energy on:**
- Perfect detail in every area
- Rendering every single hair
- Making backgrounds super complex
- Copying your reference exactly

## Your Challenge

Take on this exercise:
1. Choose a portrait reference
2. Set a timer for 1 hour
3. First 40 minutes: Only proportions and values (no details!)
4. Last 20 minutes: Refine focal point only

Post your result and tag me! I want to see how these tips help your work.

Remember, every master artist you admire made all these mistakes too. The difference? They learned from them instead of repeating them.

What's YOUR biggest portrait struggle? Drop a comment below and let's solve it together!

---

*Want to dive deeper? I'm launching an online portrait course next month covering anatomy, values, and creating life-like portraits in any medium. Join the waitlist at karenartist.com/courses*`,
          'After teaching portrait painting for 10+ years, I\'ve identified the five mistakes that hold back 90% of beginner artists. Here\'s how to fix them and level up your portrait skills immediately.',
          true,
          new Date()
        ]
      );
      logger.info('✅ Blog post 2 created: 5 Mistakes Every Beginner Portrait Artist Makes');

      logger.info('✅ Database seeding completed successfully');
      logger.info('\n📝 Sample content created:');
      logger.info('   - 2 Rich blog posts from Karen Duplisea');
      logger.info('   - Ready for testing and demo!\n');
    } finally {
      connection.release();
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
