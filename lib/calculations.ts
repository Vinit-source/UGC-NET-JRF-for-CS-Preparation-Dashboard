import { getDB } from './db';
import { getSyllabusFlatList, SyllabusItem } from './syllabus';

export interface ConfidenceData {
  directScore?: number;
  averageScore?: number;
  finalScore: number;
}

export async function calculateConfidence() {
  const db = await getDB();
  const allScores = await db.getAll('scores');
  const flatSyllabus = getSyllabusFlatList();
  
  const confidenceMap = new Map<string, ConfidenceData>();
  const scoreMap = new Map<string, { totalScore: number, totalMax: number, count: number }>();

  // Aggregate direct scores
  for (const score of allScores) {
    const current = scoreMap.get(score.targetId) || { totalScore: 0, totalMax: 0, count: 0 };
    scoreMap.set(score.targetId, {
      totalScore: current.totalScore + score.score,
      totalMax: current.totalMax + score.maxScore,
      count: current.count + 1
    });
  }

  // Calculate subtopics first
  const subtopics = flatSyllabus.filter(item => item.type === 'subtopic');
  for (const sub of subtopics) {
    const s = scoreMap.get(sub.id);
    if (s && s.totalMax > 0) {
      const score = (s.totalScore / s.totalMax) * 100;
      confidenceMap.set(sub.id, { directScore: score, finalScore: score });
    }
  }

  // Calculate topics
  const topics = flatSyllabus.filter(item => item.type === 'topic');
  for (const topic of topics) {
    let topicDirectScore = 0;
    let topicDirectMax = 0;
    const direct = scoreMap.get(topic.id);
    if (direct) {
      topicDirectScore = direct.totalScore;
      topicDirectMax = direct.totalMax;
    }

    let subtopicAvg = 0;
    let subtopicCount = 0;
    if (topic.children) {
      for (const sub of topic.children) {
        const subConf = confidenceMap.get(sub.id);
        if (subConf !== undefined) {
          subtopicAvg += subConf.finalScore;
          subtopicCount++;
        }
      }
    }

    if (subtopicCount > 0) {
      subtopicAvg = subtopicAvg / subtopicCount;
    }

    let finalTopicConf = 0;
    let confCount = 0;
    let dScore: number | undefined;
    let aScore: number | undefined;

    if (topicDirectMax > 0) {
      dScore = (topicDirectScore / topicDirectMax) * 100;
      finalTopicConf += dScore;
      confCount++;
    }
    if (subtopicCount > 0) {
      aScore = subtopicAvg;
      finalTopicConf += aScore;
      confCount++;
    }

    if (confCount > 0) {
      confidenceMap.set(topic.id, {
        directScore: dScore,
        averageScore: aScore,
        finalScore: finalTopicConf / confCount
      });
    }
  }

  // Calculate units
  const units = flatSyllabus.filter(item => item.type === 'unit');
  // Reverse to process bottom-up if there are nested units (like Paper 1 -> Unit 1)
  for (let i = units.length - 1; i >= 0; i--) {
    const unit = units[i];
    let unitDirectScore = 0;
    let unitDirectMax = 0;
    const direct = scoreMap.get(unit.id);
    if (direct) {
      unitDirectScore = direct.totalScore;
      unitDirectMax = direct.totalMax;
    }

    let childAvg = 0;
    let childCount = 0;
    if (unit.children) {
      for (const child of unit.children) {
        const childConf = confidenceMap.get(child.id);
        if (childConf !== undefined) {
          childAvg += childConf.finalScore;
          childCount++;
        }
      }
    }

    if (childCount > 0) {
      childAvg = childAvg / childCount;
    }

    let finalUnitConf = 0;
    let confCount = 0;
    let dScore: number | undefined;
    let aScore: number | undefined;

    if (unitDirectMax > 0) {
      dScore = (unitDirectScore / unitDirectMax) * 100;
      finalUnitConf += dScore;
      confCount++;
    }
    if (childCount > 0) {
      aScore = childAvg;
      finalUnitConf += aScore;
      confCount++;
    }

    if (confCount > 0) {
      confidenceMap.set(unit.id, {
        directScore: dScore,
        averageScore: aScore,
        finalScore: finalUnitConf / confCount
      });
    }
  }

  return confidenceMap;
}
