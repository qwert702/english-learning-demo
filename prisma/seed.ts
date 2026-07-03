// seed.ts — demo 种子数据：1 篇听力文章 + 1 套一年级试卷
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── 1. 听力阅读文章 ──────────────────────────────────
  const articleTitle = "My Favorite Animal";
  const existing = await prisma.article.findFirst({ where: { title: articleTitle } });

  if (!existing) {
    await prisma.article.create({
      data: {
        title: articleTitle,
        content: "My favorite animal is the dolphin. Dolphins are very smart. They live in the ocean. They can swim very fast. Dolphins like to play with people. They are friendly and kind. I think dolphins are the best animals in the world!",
        level: "A1",
        category: "STORY",
        type: "EXTRA",
        source: "ai_generated",
        wordCount: 46,
        isPublic: true,
        sentences: JSON.stringify(
          [
            "My favorite animal is the dolphin.",
            "Dolphins are very smart.",
            "They live in the ocean.",
            "They can swim very fast.",
            "Dolphins like to play with people.",
            "They are friendly and kind.",
            "I think dolphins are the best animals in the world!",
          ].map((text, i) => ({ text, startTime: i * 4, cn: "" }))
        ),
      },
    });
    console.log(`✅ 已创建文章: ${articleTitle}`);
  } else {
    console.log(`⏭️ 文章已存在: ${articleTitle}`);
  }

  // ── 2. 一年级试卷 ────────────────────────────────────
  const examTitle = "一年级上册英语期末模拟试卷";
  const existingExam = await prisma.article.findFirst({ where: { title: examTitle } });

  if (!existingExam) {
    await prisma.article.create({
      data: {
        title: examTitle,
        content: "一年级上册英语期末原创模拟试卷 - 考试时长60分钟 满分100分",
        level: "A1",
        category: "ACADEMIC",
        type: "EXAM",
        grade: "G1",
        source: "ai_generated",
        wordCount: 0,
        isPublic: true,
        sentences: JSON.stringify({
          sections: [
            {
              id: "listen_1",
              title: "Ⅰ. 听音选图（每小题2分，共10分）",
              type: "listen_choice",
              scorePerItem: 2,
              instructions: "听录音，选择正确的图片",
              items: [
                { text: "This is a cat.", answer: "A" },
                { text: "I have a red apple.", answer: "B" },
                { text: "The sun is yellow.", answer: "C" },
                { text: "She is a teacher.", answer: "D" },
                { text: "I like dogs.", answer: "E" },
              ],
            },
            {
              id: "listen_2",
              title: "Ⅱ. 听对话选答语（每小题2分，共10分）",
              type: "listen_dialog",
              scorePerItem: 2,
              instructions: "听对话，选择最佳答案",
              items: [
                { dialog: "W: What's this? M: It's a book.", question: "What's this?", options: ["A pen", "A book", "A bag", "A desk"], answer: "B" },
                { dialog: "W: How are you? M: I'm fine, thank you.", question: "How is he?", options: ["Sad", "Fine", "Tired", "Hungry"], answer: "B" },
                { dialog: "W: What color is it? M: It's blue.", question: "What color is it?", options: ["Red", "Blue", "Green", "Yellow"], answer: "B" },
                { dialog: "W: How old are you? M: I'm seven.", question: "How old is he?", options: ["Six", "Seven", "Eight", "Nine"], answer: "B" },
                { dialog: "W: Is this your pencil? M: Yes, it is.", question: "Is it his pencil?", options: ["Yes", "No", "I don't know", "Maybe"], answer: "A" },
              ],
            },
            {
              id: "grammar_choice",
              title: "Ⅲ. 单项选择（每小题2分，共20分）",
              type: "multiple_choice",
              scorePerItem: 2,
              items: [
                { question: "Hello, ___ name is Tom.", options: ["I", "my", "me", "mine"], answer: "B" },
                { question: "This ___ a dog.", options: ["am", "is", "are", "be"], answer: "B" },
                { question: "I ___ a student.", options: ["am", "is", "are", "be"], answer: "A" },
                { question: "___ are you? —I'm fine.", options: ["What", "How", "Where", "Who"], answer: "B" },
                { question: "It ___ a big elephant.", options: ["am", "is", "are", "be"], answer: "B" },
                { question: "Close the ___ , please.", options: ["book", "door", "bag", "pen"], answer: "B" },
                { question: "What colour ___ the apple?", options: ["am", "is", "are", "be"], answer: "B" },
                { question: "I have two ___.", options: ["hand", "hands", "a hand", "the hand"], answer: "B" },
                { question: "___ is my mother.", options: ["He", "She", "It", "They"], answer: "B" },
                { question: "How many ___?", options: ["book", "books", "a book", "the book"], answer: "B" },
              ],
            },
            {
              id: "fill_blank",
              title: "Ⅳ. 选词填空（每小题2分，共10分）",
              type: "fill_blank",
              scorePerItem: 2,
              items: [
                { question: "She ___ (like) reading books.", answer: "likes" },
                { question: "They ___ (be) my friends.", answer: "are" },
                { question: "I ___ (have) a new bike.", answer: "have" },
                { question: "He ___ (go) to school by bus.", answer: "goes" },
                { question: "We ___ (not) like cold weather.", answer: "don't" },
              ],
            },
            {
              id: "reading_A",
              title: "Ⅴ. 阅读理解（每小题3分，共15分）",
              type: "reading",
              scorePerItem: 3,
              items: [
                {
                  title: "My Pet",
                  content: "I have a pet. It is a dog. It is brown. It has two big eyes and a small nose. It likes to run in the park. I love my dog.",
                  questions: [
                    { question: "What pet does the writer have?", options: ["A cat", "A dog", "A fish", "A bird"], answer: "B" },
                    { question: "What color is the dog?", options: ["Black", "White", "Brown", "Yellow"], answer: "C" },
                    { question: "Where does the dog like to run?", options: ["In the house", "In the park", "In the school", "In the garden"], answer: "B" },
                    { question: "How does the writer feel about the dog?", options: ["Hates it", "Loves it", "Scared of it", "Doesn't like it"], answer: "B" },
                    { question: "How many eyes does the dog have?", options: ["One", "Two", "Three", "Four"], answer: "B" },
                  ],
                },
              ],
            },
          ],
        }),
      },
    });
    console.log(`✅ 已创建试卷: ${examTitle}`);
  } else {
    console.log(`⏭️ 试卷已存在: ${examTitle}`);
  }

  // ── 3. 创建管理员账号 ────────────────────────────────
  const adminEmail = "admin@demo.com";
  const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    const bcrypt = await import("bcryptjs");
    await prisma.user.create({
      data: {
        name: "管理员",
        email: adminEmail,
        password: await bcrypt.hash("admin123", 12),
        role: "admin",
      },
    });
    console.log(`✅ 已创建管理员: admin@demo.com / admin123`);
  } else {
    console.log(`⏭️ 管理员已存在: admin@demo.com`);
  }

  console.log("\n✅ 种子数据完成!");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
