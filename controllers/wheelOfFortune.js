const WheelOfFortuneModel = require("../model/wheelOfFortune");
const WheelOfFortuneContentModel = require("../model/wheelOfFortuneContent");

const transformedWheelOfFortune = (data) => data.map(item => ({
    id: item._id,
    code: item.code,
    content: item.content.map(contentItem => ({
      id: contentItem._id,
      color: contentItem.color,
      title: contentItem.title
    })),
    description: item.description
  })
);


async function getWheelOfFortuneList(req, res) {
  let fortuneList;

  try {
    fortuneList = await WheelOfFortuneModel.find().populate('content');
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  return res.json({ status: "OK", data: transformedWheelOfFortune(fortuneList) });
}

async function getWheelOfFortuneData(req, res) {
  let wheelOfFortuneData;

  try {
    wheelOfFortuneData = await WheelOfFortuneModel.findOne({ code: req.query.code });
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  return res.json({ status: "OK", data: wheelOfFortuneData });
}

async function addWheelOfFortune(req, res) {
  const { code, description, content } = req.body;

  try {
    const newFortune = new WheelOfFortuneModel({ code, description });
    newFortune.content = [];

    for (const contentItem of content) {
      const newContentItem = new WheelOfFortuneContentModel(contentItem);
      await newContentItem.save();
      newFortune.content.push(newContentItem)
    }

    await newFortune.save();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const fortuneList = await WheelOfFortuneModel.find().populate('content');

  return res.json({ status: "OK", data: transformedWheelOfFortune(fortuneList) });
}

async function editWheelOfFortune(req, res) {
  try {
    const fortune = await WheelOfFortuneModel.findById(req.body.id);

    for (const fortuneContentItem of fortune.content) {
      await WheelOfFortuneContentModel.deleteOne({ _id: fortuneContentItem._id });
    }

    fortune.code = req.body.code;
    fortune.description = req.body.description;
    fortune.content = [];

    for (const contentItem of req.body.content) {
      const newContentItem = new WheelOfFortuneContentModel(contentItem);
      await newContentItem.save();
      fortune.content.push(newContentItem)
    }

    await fortune.save();
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const fortuneList = await WheelOfFortuneModel.find().populate('content');

  return res.json({ status: "OK", data: transformedWheelOfFortune(fortuneList) });
}

async function deleteWheelOfFortune(req, res) {
  try {
    const fortune = await WheelOfFortuneModel.findById(req.body.id);

    await WheelOfFortuneModel.deleteOne({ _id: req.body.id });

    for (const fortuneContentItem of fortune.content) {
      await WheelOfFortuneContentModel.deleteOne({ _id: fortuneContentItem._id });
    }
  } catch (err) {
    return res.json({ status: "ERROR", message: err._message });
  }

  const fortuneList = await WheelOfFortuneModel.find().populate('content');

  return res.json({ status: "OK", data: transformedWheelOfFortune(fortuneList) });
}

module.exports = {
  getWheelOfFortuneList,
  getWheelOfFortuneData,
  addWheelOfFortune,
  editWheelOfFortune,
  deleteWheelOfFortune
};
