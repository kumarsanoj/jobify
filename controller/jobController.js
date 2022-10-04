import Jobs from "../models/Jobs.js"
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

const createJob = async (req, res, next) => {
    const { position, company } = req.body;
    try {
        if (!position || !company) {
            throw new BadRequestError('Please provide values')
        }
        req.body.createdBy = req.user.userId;
        const job = await Jobs.create(req.body);
        res.status(StatusCodes.CREATED).json({ job })
        res.send('Create Job')
    } catch(err) {
        next(err)
    }
}
const deleteJob = async (req, res) => {
    res.send('delete Job')
}
const getAllJobs = async (req, res) => {
    const jobs = await Jobs.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ jobs, totalJobs: jobs.length, numOfPages: 1})
    res.send('get All Jobs')
}
const updateJobs = async (req, res) => {
    res.send('update Jobs')
}
const showStatus = async (req, res) => {
    res.send('show Status')
}



export { createJob, deleteJob, getAllJobs, updateJobs, showStatus}