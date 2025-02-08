import { execCode } from "cp-code-runner";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const question = {
  1: {
    publicStdIn: ["4\n1 2 3 4", "5\n1 2 3 4 5"],
    stdin: ["3\n 1 2 3", "4\n 1 2 3 4", "5\n 1 2 3 4 5"],
    expectedOutput: ["6\n", "10\n", "15\n"],
  },
  2: {
    publicStdIn: ["4\n5 1 9 3", "3\n-10 0 5"],
    stdin: ["3\n 1 5 -8", "4\n 1 2 3 4", "5\n 1 2 3 4 5"],
    expectedOutput: ["5\n", "4\n", "5\n"],
  },
  3: {
    publicStdIn: ["5\n1 2 3 4 5", "6\n10 20 30 15 25 35"],
    stdin: ["6\n 1 2 3 4 5 6", "4\n 0 2 4 6", "10\n 1 1 1 1 1 1 1 1 1 1"],
    expectedOutput: ["3\n", "4\n", "0\n"],
  },
};

export const run = async (req, res) => {
  try {
    const { code, languageId, QuestionId } = req.body;

    if (!question[QuestionId]) {
      return res.status(400).json({ status: "Failed", message: "Invalid Question ID" });
    }

    let currStdin = question[QuestionId].publicStdIn;
    let outputs = [];

    for (let i = 0; i < currStdin.length; i++) {
      const result = await execCode(languageId, code, currStdin[i], 5000);
      
      if (result.status === "failed" && result.stderr === "Time limit exceeded") {
        return res.status(200).json({ status: "Failed", message: "Time limit exceeded" });
      } else if (result.status === "failed") {
        return res.status(200).json({ status: "Failed", message: "There is an error in the code" });
      }

      outputs.push(result.stdout.trim());
    }

    return res.status(200).json({ status: "Success", outputs });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const submit = async (req, res) => {
  try {
    const { email,code,languageId,QuestionId } = req.body;

    if (!question[QuestionId]) {
      return res.status(400).json({ status: "Failed", message: "Invalid Question ID" });
    }

    let currStdin = question[QuestionId].stdin;
    let currEout = question[QuestionId].expectedOutput;

    for (let i = 0; i < currStdin.length; i++) {
      const result = await execCode(languageId, code, currStdin[i], 5000);
      
      if (result.status === "failed" && result.stderr === "Time limit exceeded") {
        return res.status(200).json({ status: "Failed", message: "Time limit exceeded" });
      } else if (result.status === "failed") {
        return res.status(200).json({ status: "Failed", message: "There is an error in the code" });
      }

      if (!validateOutput(result.stdout, currEout[i])) {
        return res.status(200).json({ status: "Failed", message: "Hidden test cases failed" });
      }
    }

    await prisma.log.create({
        data: {
            email:email,
            problemId:QuestionId.toString()
        },
      });

    await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          problemsSolved: {
            increment: 1,
          },
        },});

    return res.status(200).json({ status: "Accepted", message: "" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const validateOutput = (a, b) => {
  return a.trim() === b.trim();
};