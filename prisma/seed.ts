import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.musicTrack.deleteMany()
  await prisma.video.deleteMany()
  await prisma.post.deleteMany()
  await prisma.socialLink.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.achievement.deleteMany() // Clear achievements
  await prisma.collaboration.deleteMany() // Clear collaborations
  await prisma.stat.deleteMany() // Clear stats
  await prisma.contactSubmission.deleteMany() // Clear contact submissions

  // Seed Music Tracks (6 published and featured)
  const musicTracks = await Promise.all([
    prisma.musicTrack.create({
      data: {
        title: "Epic Heroic Motivational Music 1",
        category: "Heroic",
        description: "A powerful and inspiring orchestral piece.",
        status: "Published",
        published: true,
        featured: true,
        audioUrl: "https://example.com/audio/epic-heroic-1.mp3",
        coverImageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
        fileSize: "5.2MB"
      }
    }),
    prisma.musicTrack.create({
      data: {
        title: "Heart Of A Warrior 2",
        category: "Motivational",
        description: "An uplifting and determined orchestral track.",
        status: "Published",
        published: true,
        featured: true,
        audioUrl: "https://example.com/audio/heart-warrior-2.mp3",
        coverImageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop",
        fileSize: "4.8MB"
      }
    }),
    prisma.musicTrack.create({
      data: {
        title: "Girang si GEMAWAN 3",
        category: "Gamelan",
        description: "A modern gamelan composition blending tradition with contemporary sounds.",
        status: "Published",
        published: true,
        featured: true,
        audioUrl: "https://example.com/audio/girang-gemawan-3.mp3",
        coverImageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
        fileSize: "7.1MB"
      }
    }),
    prisma.musicTrack.create({
      data: {
        title: "Digital Dreams 4",
        category: "Electronic",
        description: "An atmospheric electronic track with dreamy synths.",
        status: "Published",
        published: true,
        featured: true,
        audioUrl: "https://example.com/audio/digital-dreams-4.mp3",
        coverImageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
        fileSize: "6.0MB"
      }
    }),
    prisma.musicTrack.create({
      data: {
        title: "Cultural Fusion 5",
        category: "World",
        description: "A blend of world music elements and modern production.",
        status: "Published",
        published: true,
        featured: true,
        audioUrl: "https://example.com/audio/cultural-fusion-5.mp3",
        coverImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
        fileSize: "5.5MB"
      }
    }),
    prisma.musicTrack.create({
      data: {
        title: "Ambient Chill 6",
        category: "Ambient",
        description: "Relaxing ambient soundscapes.",
        status: "Published",
        published: true,
        featured: true,
        audioUrl: "https://example.com/audio/ambient-chill-6.mp3",
        coverImageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=400&fit=crop",
        fileSize: "4.0MB"
      }
    }),
  ])

  // Seed Videos (6 published and featured)
  const videos = await Promise.all([
    prisma.video.create({
      data: {
        title: "Epic Heroic Motivational Video 1",
        videoId: "dQw4w9WgXcQ",
        category: "Heroic",
        description: "An inspiring video to motivate you.",
        published: true,
        featured: true
      }
    }),
    prisma.video.create({
      data: {
        title: "Heart Of A Warrior Video 2",
        videoId: "M7lc1UVf-VE",
        category: "Motivational",
        description: "The official music video for Heart of a Warrior.",
        published: true,
        featured: true
      }
    }),
    prisma.video.create({
      data: {
        title: "Behind the Scenes - Studio Session 3",
        videoId: "2z_2L_g_0Q",
        category: "Behind the Scenes",
        description: "A look into the creative process in the studio.",
        published: true,
        featured: true
      }
    }),
    prisma.video.create({
      data: {
        title: "Gamelan Music Tutorial 4",
        videoId: "dQw4w9WgXcQ",
        category: "Educational",
        description: "Learn the basics of traditional Gamelan music.",
        published: true,
        featured: true
      }
    }),
    prisma.video.create({
      data: {
        title: "Live Performance Highlight 5",
        videoId: "some_other_id_5",
        category: "Performance",
        description: "A highlight reel from a recent live show.",
        published: true,
        featured: true
      }
    }),
    prisma.video.create({
      data: {
        title: "Interview with the Artist 6",
        videoId: "yet_another_id_6",
        category: "Interview",
        description: "An in-depth interview discussing creative influences.",
        published: true,
        featured: true
      }
    }),
  ])

  // Seed Blog Posts (6 published and featured)
  const blogPosts = await Promise.all([
    prisma.post.create({
      data: {
        title: "The Art of Composing Epic Orchestral Music 1",
        content: `# The Art of Composing Epic Orchestral Music 1\n\nComposing epic orchestral music is a journey that combines technical skill with creative vision.`, 
        excerpt: "Discover the techniques and creative process behind composing powerful orchestral music.",
        category: "Composition",
        tags: "orchestral, composition, music theory",
        featured: true,
        published: true,
        views: 156,
        authorId: "default-author"
      }
    }),
    prisma.post.create({
      data: {
        title: "Bridging Tradition and Innovation 2",
        content: `# Bridging Tradition and Innovation 2\n\nAs a composer deeply rooted in traditional Malay music, I've always been fascinated by the challenge of bringing ancient musical forms into the modern era.`, 
        excerpt: "Exploring the fusion of traditional and modern music.",
        category: "Culture",
        tags: "gamelan, fusion, innovation",
        featured: true,
        published: true,
        views: 200,
        authorId: "default-author"
      }
    }),
    prisma.post.create({
      data: {
        title: "My Creative Process: From Idea to Masterpiece 3",
        content: `# My Creative Process: From Idea to Masterpiece 3\n\nDelving into the step-by-step process of bringing musical ideas to life.`, 
        excerpt: "A deep dive into the creative journey of a composer.",
        category: "Process",
        tags: "creativity, workflow, inspiration",
        featured: true,
        published: true,
        views: 180,
        authorId: "default-author"
      }
    }),
    prisma.post.create({
      data: {
        title: "The Future of Music Production 4",
        content: `# The Future of Music Production 4\n\nExploring new technologies and trends shaping the music industry.`, 
        excerpt: "Insights into upcoming innovations in music production.",
        category: "Technology",
        tags: "production, future, AI",
        featured: true,
        published: true,
        views: 250,
        authorId: "default-author"
      }
    }),
    prisma.post.create({
      data: {
        title: "Behind the Scenes: Scoring for Film 5",
        content: `# Behind the Scenes: Scoring for Film 5\n\nA look into the challenges and rewards of composing for visual media.`, 
        excerpt: "Composing music for movies and TV shows.",
        category: "Film Scoring",
        tags: "film, media, composition",
        featured: true,
        published: true,
        views: 190,
        authorId: "default-author"
      }
    }),
    prisma.post.create({
      data: {
        title: "Understanding Music Theory Basics 6",
        content: `# Understanding Music Theory Basics 6\n\nAn introductory guide to fundamental music theory concepts for aspiring musicians.`, 
        excerpt: "A beginner's guide to the building blocks of music.",
        category: "Education",
        tags: "theory, basics, learning",
        featured: true,
        published: true,
        views: 170,
        authorId: "default-author"
      }
    }),
  ])

  // Seed Testimonials (3 published, 2 unpublished)
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: "Alice Smith",
        role: "Filmmaker",
        content: "The music provided was absolutely breathtaking and perfectly captured the essence of our film. Highly recommended!",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        published: true,
        featured: true
      }
    }),
    prisma.testimonial.create({
      data: {
        name: "Bob Johnson",
        role: "Game Developer",
        content: "Incredible sound design and immersive scores. Our game truly came alive with their audio.",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        published: true,
        featured: false
      }
    }),
    prisma.testimonial.create({
      data: {
        name: "Charlie Brown",
        role: "Creative Director",
        content: "A true professional with an amazing ability to translate vision into sound. Will definitely work with again.",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        published: true,
        featured: true
      }
    }),
    prisma.testimonial.create({
      data: {
        name: "Diana Prince",
        role: "Artist",
        content: "Their music added so much depth and emotion to my art installation. A fantastic collaboration.",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        published: false,
        featured: false
      }
    }),
    prisma.testimonial.create({
      data: {
        name: "Eve Adams",
        role: "Podcast Host",
        content: "The intro and outro music they created for my podcast are perfect. Exactly what I envisioned.",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
        published: false,
        featured: false
      }
    }),
  ])

  // Seed Achievements (3 published, 2 unpublished)
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        title: "Award for Best Original Score",
        description: "Received the prestigious 'Golden Melody Award' for original score in 'The Silent Echoes'.",
        year: "2023",
        icon: "🏆",
        type: "Award"
      }
    }),
    prisma.achievement.create({
      data: {
        title: "Featured in 'Sound Design Monthly'",
        description: "Interviewed for a feature article on innovative sound design techniques.",
        year: "2022",
        icon: "📰",
        type: "Publication"
      }
    }),
    prisma.achievement.create({
      data: {
        title: "Completed Master's in Music Composition",
        description: "Graduated with distinction from the Royal Academy of Music.",
        year: "2021",
        icon: "🎓",
        type: "Education"
      }
    }),
    prisma.achievement.create({
      data: {
        title: "Collaborated with Renowned Orchestra",
        description: "Worked with the London Symphony Orchestra on a new contemporary piece.",
        year: "2024",
        icon: "🎻",
        type: "Collaboration"
      }
    }),
    prisma.achievement.create({
      data: {
        title: "Launched New Sample Pack",
        description: "Released 'Cinematic Textures Vol. 1' sample pack to critical acclaim.",
        year: "2024",
        icon: "💿",
        type: "Product"
      }
    }),
  ])

  // Seed Collaborations (3 entries)
  const collaborations = await Promise.all([
    prisma.collaboration.create({
      data: {
        name: "Studio Ghibli",
        role: "Composer",
        description: "Composed original scores for their latest animated feature film.",
        link: "https://www.ghibli.jp/",
        image: "https://upload.wikimedia.org/wikipedia/en/thumb/c/ca/Studio_Ghibli_logo.svg/1200px-Studio_Ghibli_logo.svg.png"
      }
    }),
    prisma.collaboration.create({
      data: {
        name: "Ubisoft",
        role: "Sound Designer",
        description: "Provided immersive soundscapes and effects for their upcoming open-world game.",
        link: "https://www.ubisoft.com/",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Ubisoft_logo.svg/1200px-Ubisoft_logo.svg.png"
      }
    }),
    prisma.collaboration.create({
      data: {
        name: "TEDx",
        role: "Guest Speaker",
        description: "Delivered a talk on 'The Emotional Power of Music in Storytelling'.",
        link: "https://www.ted.com/tedx",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/TEDx_logo.svg/1200px-TEDx_logo.svg.png"
      }
    }),
  ])

  // Seed Stats (3 entries)
  const stats = await Promise.all([
    prisma.stat.create({
      data: {
        label: "Projects Completed",
        value: "50+",
        icon: "✅"
      }
    }),
    prisma.stat.create({
      data: {
        label: "Years Experience",
        value: "10",
        icon: "🗓️"
      }
    }),
    prisma.stat.create({
      data: {
        label: "Awards Won",
        value: "5",
        icon: "🏆"
      }
    }),
  ])

  // Seed Contact Submissions (2 entries)
  const contactSubmissions = await Promise.all([
    prisma.contactSubmission.create({
      data: {
        name: "John Doe",
        email: "john.doe@example.com",
        subject: "Inquiry about collaboration",
        message: "I'm interested in collaborating on a new project. Please contact me.",
        phone: "123-456-7890",
        company: "Acme Corp"
      }
    }),
    prisma.contactSubmission.create({
      data: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        subject: "Feedback on your music",
        message: "Your latest track is amazing! Keep up the great work.",
        phone: null,
        company: null
      }
    }),
  ])

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })