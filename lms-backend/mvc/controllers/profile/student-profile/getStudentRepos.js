const studentModel = require("../../../models/studentModel");
const studentDetailsModel = require("../../../models/studentDetailsModel");
const { default: axios } = require("axios");
const getStudentLanguages = async (username, repos, config) => {
  let languages = {};
  let languagesArray = [],
    totalPoints = 0;
  for (let i = 0; i < repos.length; i++) {
    try {
      let data = await axios.get(
        "https://api.github.com/repos/" + repos[i].name + "/languages",
        config
      );
      let languagesData = data.data;

      for (let language in languagesData) {
        if (languages[language]) {
          languages[language] += languagesData[language];
        } else {
          languages[language] = languagesData[language];
        }
        totalPoints += languagesData[language];
      }
    } catch (err) {
      console.log(err);
    }
  }
  // console.log(totalPoints);
  for (let language in languages) {
    let score = (languages[language] / totalPoints) * 100;
    languagesArray.push({
      language: language,
      points: languages[language],
      score: Math.round((score + Number.EPSILON) * 100) / 100,
    });
  }
  languagesArray = languagesArray.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return b.points - a.points;
  });
  return languagesArray;
};
const getStudentCommits = async (username, repos, config) => {
  let commits = [];
  for (let i = 0; i < repos.length; i++) {
    try {
      let data = await axios.get(
        "https://api.github.com/repos/" + repos[i].name + "/commits",
        config
      );
      let commitsData = data.data;
      commitsData.forEach((commit) => {
        if (commit?.author?.login == username) {
          commits.push({
            repo_url: repos[i].url,
            repo_name: repos[i].name,
            sha: commit.sha,
            html_url: commit.html_url,
            message: commit.message,
            date: new Date(commit.commit.author.date).getTime(),
          });
        }
      });

      commits = commits.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return b.date - a.date;
      });
      commits = commits.length > 30 ? commits.slice(0, 30) : commits;
      // console.log(commits);
    } catch (err) {
      console.log(err);
    }
  }
  return commits;
};
const getStudentRepos = async (req, res) => {
  try {
    let student = await studentModel.find({ _id: req.body.userId });
    if (student.length > 0) {
      student = student[0];
      let studentDetails = await studentDetailsModel.find({
        "email.value": student.email,
      });
      if (studentDetails.length > 0) {
        studentDetails = studentDetails[0];
        if (studentDetails.gitHub.givenAccess) {
          const config = {
            headers: {
              Authorization: `Bearer ${studentDetails.gitHub.accessToken}`,
            },
          };
          axios
            .get(
              "https://api.github.com/users/" +
                studentDetails.gitHub.githubUsername +
                "/repos",
              config
            )
            .then(async (reposData) => {
              reposData = reposData.data;
              reposData = reposData.map((repo) => {
                return {
                  name: repo.full_name,
                  url: repo.html_url,
                };
              });
              let transformedCommits = await getStudentCommits(
                studentDetails.gitHub.githubUsername,
                reposData,
                config
              );
              let transformedLanguages = await getStudentLanguages(
                studentDetails.gitHub.githubUsername,
                reposData,
                config
              );
              res.status(200).send({
                data: {
                  access: true,
                  repos: reposData,
                  commits: transformedCommits,
                  languages: transformedLanguages,
                },
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send({ data: { access: true } });
            });
        } else {
          res.status(200).send({ data: { access: false } });
        }
      } else {
        res.status(500).send({ message: "Student Not found" });
      }
    } else {
      res.status(500).send({ message: req.body });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "something went wrong" });
  }
};
module.exports = { getStudentRepos };
