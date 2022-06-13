const db = require("../models");
const {
    course: Courses,
    module: Module,
    questionBank: QuestionBank,
    program: Program,
    user: User,
    role: Role,
    audit: Audit,
    programAllocation: ProgramAllocation
} = db;
const fs = require('fs');
const path = require('path')
const formidable = require('formidable');
var request = require('request');
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Jimp = require("jimp");

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


exports.uploadFile = (req, res) => {
    const form = new formidable.IncomingForm({
        allowEmptyFiles: false,
        keepExtensions: true
    });
    form.parse(req, function (err, fields, files) {
        if (fields.file !== "") {
            var oldPath = files.file.filepath;
            var newPath = path.join(__dirname, '../../uploads') +
                '/' + files.file.newFilename
            var rawData = fs.readFileSync(oldPath)

            fs.writeFile(newPath, rawData, function (err) {

                res.status(200).send({
                    status: "success",
                    message: "Successfully Uploaded",
                    data: {
                        url: files.file.newFilename
                    }
                });
            });
        } else {
            res.status(500).send({
                status: "error",
                message: "File is Missing"
            });
        }
    });
};

exports.retrieveFile = (req, res, next) => {
    try {
        
        res.status(200).sendFile(path.join(__dirname, '../../uploads/' + req.params.file));
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "File is Missing"
        });
    }
}

exports.retrieveCertificateFile = (req, res, next) => {
    try {
        res.status(200).sendFile(path.join(__dirname, '../../certificates/' + req.params.file));
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "File is Missing"
        });
    }
}

exports.downloadCSVFile = (req, res, next) => {
    try {
        res.status(200).sendFile(path.join(__dirname, '../../uploads/' + req.params.file));
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: "File is Missing"
        });
    }
}

exports.employeeSync = (req, res) => {
    var options = {
        'method': 'POST',
        'url': 'https://portal.zinghr.com/2015/route/EmployeeDetails/GetEmployeeDetails',
        'headers': {
            'Content-Type': 'application/json',
            'Cookie': 'BNIS___utm_is1=B60Jak8HFom44MXFX4khxaMCNMcdGYxj1CtF5/FGjzpTd7XATQQaK8QBsMyfBWhZ9d2ryUbBEUX1POTveJIHEJ7CmijMkvH2Svp17Q8dQ/wSGXonM3iPHw==; BNIS___utm_is2=zUOmM9deK1HgEcKo1NvwD9KWOQQMjoLnRQ1btVBEQCaDneEpfa2oV57yQQrUuRanUpI9w7KCZZQ='
        },
        body: JSON.stringify({
            "SubscriptionName": "Fusion",
            "Token": "a4ee2cfc287a4ee98fdf2cdaa1249788",
            "Fromdate": "01-11-2021",
            "Todate": "01-11-2021"
        })
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
        var obj = JSON.parse(response.body);
        if (obj.Employees.length > 0) {
            for (let i = 0; i < obj.Employees.length; i++) {
                const employee = obj.Employees[i];
                User.find({
                    employeeCode: employee.EmployeeCode
                }, (err, dt) => {
                    if (dt.length == 0) {
                        let department = "";
                        let state="";
                        let cluster="";
                        let branch="";
                        let designation="";
                        for (let j = 0; j < employee.Attributes.length; j++) {
                            if (employee.Attributes[j].AttributeTypeCode == "Department") {
                                department = employee.Attributes[j].AttributeTypeUnitCode;
                            }
                            if (employee.Attributes[j].AttributeTypeCode == "State") {
                                state = employee.Attributes[j].AttributeTypeUnitCode;
                            }
                            if (employee.Attributes[j].AttributeTypeCode == "Cluster") {
                                cluster = employee.Attributes[j].AttributeTypeUnitDesc;
                            }
                            if (employee.Attributes[j].AttributeTypeCode == "Branch") {
                                branch = employee.Attributes[j].AttributeTypeUnitCode;
                            }
                            if (employee.Attributes[j].AttributeTypeCode == "Designation") {
                                designation = employee.Attributes[j].AttributeTypeUnitCode;
                            }
                        }
                        let depInterval = setInterval(() => {
                            if (department != "") {
                                clearInterval(depInterval);
                                var parts =employee.DateofBirth.split('-');
                                // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
                                // January - 0, February - 1, etc.
                                let dob="";
                                if(parts[0].length != 4){
                                   dob= parts[2]+"-"+("0"+ parts[1]).slice(-2)+"-"+parts[0]
                                //   console.log(parts[2],("0"+ parts[1]).slice(-2), parts[0]); 

                                }
                                const user = new User({
                                    firstName: employee.FirstName,
                                    lastName: employee.LastName,
                                    mobile: employee.Mobile,
                                    dob: new Date(dob),
                                    email: employee.PersonalEmail,
                                    password: bcrypt.hashSync("12345678", 8),
                                    employeeCode: employee.EmployeeCode,
                                    employeeId: employee.EmployeeID,
                                    salutation: employee.Salutation,
                                    gender: employee.Gender,
                                    department: department,
                                    stateEmp:state,
                                    cluster:cluster,
                                    designation:designation,
                                    branch:branch,
                                    roles: ["61a1c01b164e8857359c3118"],
                                    status: 1

                                });

                                user.save((err, user) => {
                                    if (err) {
                                        res.status(500).send({
                                            message: err
                                        });
                                        return;
                                    }

                                });
                            }
                        }, 100);
                    }
                });

                if (i == obj.Employees.length - 1) {
                    return res.status(200).send({
                        status: "success",
                        data:obj.Employees[0]
                    });
                }
            }
        }
    });
};

exports.overallSnapshot = (req, res) => {
    let courseCount = 0;
    let programCount = 0;
    let moduleCount = 0;
    let qbCount = 0;
    Courses.count((err, data) => {
        courseCount = data;
        Program.count((err, data) => {
            programCount = data;
            Module.count((err, data) => {
                moduleCount = data;
                QuestionBank.count((err, data) => {
                    qbCount = data;
                    res.status(200).send({
                        status: "success",
                        message: "Count Fetched",
                        course: courseCount,
                        program: programCount,
                        module: moduleCount,
                        qb: qbCount
                    });
                });
            });
        });
    });



}

exports.apiLogReport = (req, res) => {

    Audit.aggregate([{
        $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userData'
        }
    }, {
        $sort: {
            createdAt: -1
        }
    }, {
        $limit: 1000
    }], (err, data) => {

        if (err) {
            res.status(500).send({
                status: "error",
                message: err
            });
            reutrn;
        }

        res.status(200).send({
            status: "success",
            message: "Audit Fetched",
            data: data
        });
    });

}

exports.searchProgramForEmployee = (req, res) => {

    let searchQuery = req.body.search.toLowerCase();
    const employeeId = mongoose.Types.ObjectId(req.body.employeeId);

    ProgramAllocation.aggregate([{
        $match: {
            type: "Program",
            employeeId: employeeId
        }
    }, {
        $lookup: {
            from: 'programs',
            localField: 'uniqueId',
            foreignField: '_id',
            as: 'programsData'
        }
    }], (err, data) => {

        if (err) {
            res.status(500).send({
                status: "error",
                message: err
            });
            reutrn;
        }

        let searchResult = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].programsData[0].title.toLowerCase().indexOf(searchQuery) != -1 || data[i].programsData[0].keywords.toLowerCase().indexOf(searchQuery) != -1) {
                searchResult.push({
                    title: data[i].programsData[0].title,
                    desc: data[i].programsData[0].description,
                    id: data[i].programsData[0]._id
                });
            }

            if (i == data.length - 1) {
                res.status(200).send({
                    status: "success",
                    message: "Search Program Result",
                    data: searchResult
                });
            }
        }
    });
}

exports.searchCourseForEmployee = (req, res) => {

    let searchQuery = req.body.search.toLowerCase();
    const employeeId = mongoose.Types.ObjectId(req.body.employeeId);

    ProgramAllocation.aggregate([{
        $match: {
            type: "Course",
            employeeId: employeeId
        }
    }, {
        $lookup: {
            from: 'courses',
            localField: 'uniqueId',
            foreignField: '_id',
            as: 'coursesData'
        }
    }], (err, data) => {

        if (err) {
            res.status(500).send({
                status: "error",
                message: err
            });
            reutrn;
        }

        let searchResult = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].coursesData[0].title.toLowerCase().indexOf(searchQuery) != -1 || data[i].coursesData[0].keywords.toLowerCase().indexOf(searchQuery) != -1) {
                searchResult.push({
                    title: data[i].coursesData[0].title,
                    desc: data[i].coursesData[0].description,
                    id: data[i].coursesData[0]._id
                });
            }

            if (i == data.length - 1) {
                res.status(200).send({
                    status: "success",
                    message: "Search Courses Result",
                    data: searchResult
                });
            }
        }
    });
}

exports.searchModuleForEmployee = (req, res) => {

    let searchQuery = req.body.search.toLowerCase();
    const employeeId = mongoose.Types.ObjectId(req.body.employeeId);

    ProgramAllocation.aggregate([{
        $match: {
            type: "Module",
            employeeId: employeeId
        }
    }, {
        $lookup: {
            from: 'modules',
            localField: 'uniqueId',
            foreignField: '_id',
            as: 'modulesData'
        }
    }], (err, data) => {

        if (err) {
            res.status(500).send({
                status: "error",
                message: err
            });
            reutrn;
        }

        let searchResult = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].modulesData[0].title.toLowerCase().indexOf(searchQuery) != -1 || data[i].modulesData[0].keywords.toLowerCase().indexOf(searchQuery) != -1) {
                searchResult.push({
                    title: data[i].modulesData[0].title,
                    desc: data[i].modulesData[0].description,
                    id: data[i].modulesData[0]._id
                });
            }

            if (i == data.length - 1) {
                res.status(200).send({
                    status: "success",
                    message: "Search Module Result",
                    data: searchResult
                });
            }
        }
    });
}

exports.searchQuizForEmployee = (req, res) => {

    let searchQuery = req.body.search.toLowerCase();
    const employeeId = mongoose.Types.ObjectId(req.body.employeeId);

    ProgramAllocation.aggregate([{
        $match: {
            type: "Quiz",
            employeeId: employeeId
        }
    }, {
        $lookup: {
            from: 'questionbanks',
            localField: 'uniqueId',
            foreignField: '_id',
            as: 'quizsData'
        }
    }], (err, data) => {

        if (err) {
            res.status(500).send({
                status: "error",
                message: err
            });
            reutrn;
        }

        let searchResult = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].quizsData[0].title.toLowerCase().indexOf(searchQuery) != -1 || data[i].quizsData[0].keywords.toLowerCase().indexOf(searchQuery) != -1) {
                searchResult.push({
                    title: data[i].quizsData[0].title,
                    desc: data[i].quizsData[0].description,
                    id: data[i].quizsData[0]._id
                });
            }

            if (i == data.length - 1) {
                res.status(200).send({
                    status: "success",
                    message: "Search Module Result",
                    data: searchResult
                });
            }
        }
    });
}

exports.createCertificate = async (req, res) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function generateString(length) {
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result;
    }

    var uniqueId=generateString(20)+'.png';
    var fileName = path.join(__dirname, '../../assets/certificate.png');
    var certificateName = path.join(__dirname, '../../certificates/'+uniqueId);
    var fs = require('fs');
    var inStr = fs.createReadStream(fileName);
    var outStr = fs.createWriteStream(certificateName);
    inStr.pipe(outStr);
    var imageCaption = req.body.salutation + " " + req.body.firstName + " " + req.body.lastName;
    var loadedImage;
    const nameFont = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
    const departmentFont = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

    Jimp.read(fileName).then(function (image) {

        image.print(nameFont,0,1700,{text: imageCaption,alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE},2430,(err, image, { x, y }) => {
            image.print(departmentFont, 0, y + 50, {text: req.body.department,alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE}, 2430);
            }).write(certificateName);
        
        res.status(200).send({
            status: "success",
            imageName:uniqueId
        });
    }).catch(function (err) {
        console.error(err);
        res.status(200).send({
            status: "error",
            date: err
        });
    });
}