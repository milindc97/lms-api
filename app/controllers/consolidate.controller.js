const db = require("../models");
const {
    questionBank: QuestionBank,
    module: Module,
    question: Question,
    course: Courses,
    program: Program
} = db;




exports.getQuestionBank = (req, res) => {
    let questionBankId = req.params.id;
    QuestionBank.findById(questionBankId).exec(function (err, cData) {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
            return;
        }


        Question.find({
            questionBankId: questionBankId
        }).exec(function (error, qData) {
            res.status(200).send({
                status: "success",
                message: "Consolidate Question Bank",
                data: cData,
                questions: qData
            });
        });
    });

};


exports.getModules = (req, res) => {
    let moduleId = req.params.id;

    Module.findById(moduleId).exec(function (errr, moduleData) {

        if (errr) {
            res.status(500).send({
                status: "error",
                message: errr.message
            });
            return;
        }

        if (moduleData.quiz.length > 0) {
            QuestionBank.find({
                _id: {
                    $in: moduleData.quiz
                }
            }).exec(function (err, cData) {
                if (err) {
                    res.status(500).send({
                        status: "error",
                        message: err.message
                    });
                    return;
                }


                const questions = [];

                for (let i = 0; i < cData.length; i++) {
                    Question.find({
                        questionBankId: cData[i]._id
                    }, (error, qData) => {
                        if (error) {
                            res.status(500).send({
                                status: "error",
                                message: error.message
                            });
                            return;
                        }


                        if (qData.length > 0) {
                            for (let j in qData)
                                questions.push(qData[j]);
                        }

                        if (i == (cData.length - 1)) {
                            res.status(200).send({
                                status: "success",
                                message: "Consolidate Module",
                                module: moduleData,
                                questionBank: cData,
                                questions: questions
                            });
                        }
                    });

                }

            });
        } else {
            res.status(200).send({
                status: "success",
                message: "Consolidate Module",
                module: moduleData,
                questionBank: {},
                questions: {}
            });
        }

    });
};


exports.getCourses = (req, res) => {
    let courseId = req.params.id;

    Courses.findById(courseId).exec(function (cError, courseData) {
        if (cError) {
            res.status(500).send({
                status: "error",
                message: errr.message
            });
            return;
        }
        const module = [];
        if (courseData.modules.length > 0) {
            for (let i = 0; i < courseData.modules.length; i++) {
                Module.find({
                    _id: courseData.modules[i].moduleId
                }, (error, mData) => {
                    if (error) {
                        res.status(500).send({
                            status: "error",
                            message: error.message
                        });
                        return;
                    }


                    if (mData.length > 0) {
                        for (let j in mData)
                            module.push(mData[j]);
                    }

                    if (i == (courseData.modules.length - 1)) {
                        res.status(200).send({
                            status: "success",
                            message: "Consolidate Module",
                            module: module,
                            course: courseData
                        });
                    }
                });

            }

                    // for(let m = 0;m<moduleData.length;m++){
                    //     if(moduleData[m].quiz.length > 0){
                    //         QuestionBank.find({_id: { $in: moduleData[m].quiz }}).exec(function (err,qbData){
                    //             if(err){
                    //                 res.status(500).send({
                    //                     status:"error",
                    //                     message: err.message
                    //                 });
                    //                 return;    
                    //             }

                    //             const questions = [];

                    //             for(let i = 0;i<qbData.length;i++){
                    //                 Question.find({questionBankId:qbData[i]._id}, (error, questionData)=>{
                    //                     if(error){
                    //                         res.status(500).send({
                    //                             status:"error",
                    //                             message: error.message
                    //                         });
                    //                         return;  
                    //                     }

                    //                     if(qData.length > 0){
                    //                         for(let j in qData)
                    //                             questions.push(qData[j]);
                    //                     }

                    //                     if(i == (qbData.length-1)){
                    //                         res.status(200).send({
                    //                             status:"success",
                    //                             message : "Consolidate Cource",
                    //                             course: courseData,
                    //                             module:moduleData,
                    //                             questionBank: qbData,
                    //                             questions: questions[0]
                    //                         });
                    //                     }
                    //                 });

                    //             } 

                    //         });
                    //     } else {
                    //         if(qData.length > 0){
                    //             for(let j in qData)
                    //                 questions.push(qData[j]);
                    //         }
                    //     }
                    // }

        } else {
            res.status(200).send({
                status: "success",
                message: "Consolidate Course",
                cData: courseData,
                mData: {}
            });
            return;
        }

    });


};

exports.getPrograms = (req, res) => {
    let programId = req.params.id;

    Program.findById(programId).exec(function (pError, programData) {
        if (pError) {
            res.status(500).send({
                status: "error",
                message: pError.message
            });
            return;
        }
        let course = [];
            let moduleData = [];
            if (programData.courses.length > 0) {
                for (let i = 0; i < programData.courses.length; i++) {
                    Courses.find({_id: programData.courses[i].courseId}, (error, cData) => {
                        if (error) {
                            res.status(500).send({
                                status: "error",
                                message: error.message
                            });
                            return;
                        }
    
                            
                            for (let j in cData){
                                course.push(cData[j]);
                                if(cData[j].modules.length > 0 ){
                                    for(let m=0;m<cData[j].modules.length;m++){
                                        Module.find({
                                            _id: cData[j].modules[m].moduleId
                                        }, (error, mData) => {
                                            if (error) {
                                                res.status(500).send({
                                                    status: "error",
                                                    message: error.message
                                                });
                                                return;
                                            }
                                            
    
                                            if (mData.length > 0) {
                                                for(let k in mData){
                                                    moduleData.push(mData[k]);
                                                }
                                            }
                                            
                                        });
                                    }
                                }
                            }
                         
    
                        if (i == (programData.courses.length - 1)) {
                            setTimeout(()=>{
                                return res.status(200).send({
                                    status: "success",
                                    message: "Consolidate Module",
                                    course: course,
                                    modules: moduleData,
                                    program: programData
                                });
                                
                            },1000);
                        }   
                    });
    
                }
    
    
            } else {
                res.status(200).send({
                    status: "success",
                    message: "Consolidate Course",
                    program: programData,
                    course: {}
                });
                return;
            }
        

    });


};

exports.getPrograms1 = (req, res) => {
    let programId = req.params.id;

    Program.aggregate([
        {
            $lookup: {from: 'courses',localField: 'courses.courseId',foreignField: '_id',as: 'courseData'}
        }, {
            $unwind: {
              path: "$courseData",
              preserveNullAndEmptyArrays: true
            }
          }, {
            $lookup: {
              from: "modules",
              localField: "modules.moduleId",
              foreignField: "_id",
              as: "modulesData",
            }
          }
    ]).exec(function (pError, programData) {
        if (pError) {
            res.status(500).send({
                status: "error",
                message: pError.message
            });
            return;
        }
        
        return res.status(200).send({
            status: "success",
            message: "Consolidate Module",
            program: programData
        });
        

    });


};