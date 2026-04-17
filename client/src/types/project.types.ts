// response from createProject
//{       "id": 10,
//         "title": "KMC-HUB",
//         "description": "A collaboration platform for students to share ideaas",
//         "liveURL": "http://localhost:8080",
//         "githubURL": "https://github.com/kasamthapa/critch",
//         "screenshotURL": "https://res.cloudinary.com/dqc0yoz3e/image/upload/v1776444479/dxicho4pilsrwujlukz2.png",
//         "screenshotPublicId": "dxicho4pilsrwujlukz2",
//         "created_at": "2026-04-17T16:48:00.283Z",
//         "updated_at": "2026-04-17T16:48:00.283Z",
//         "userId": 23,
//         "avgRating": "0",
//         "tags": [
//             "node",
//             "react",
//             "typescript"
//         ]
//     },
//response from getAllProjects
//  "projects": [
//             {
//                 "id": 2,
//                 "title": "KMC-HUB",
//                 "description": "A collaboration platform for students to share ideaas",
//                 "liveURL": "http://localhost:8080",
//                 "githubURL": "https://github.com/kasamthapa/critch",
//                 "screenshotURL": "https://res.cloudinary.com/dqc0yoz3e/image/upload/v1774956427/ae9atpepnu2hlxyzju8a.png",
//                 "screenshotPublicId": "ae9atpepnu2hlxyzju8a",
//                 "created_at": "2026-03-31T11:27:10.911Z",
//                 "updated_at": "2026-03-31T11:27:10.911Z",
//                 "userId": 20,
//                 "avgRating": "4",
//                 "_count": {
//                     "reviews": 0
//                 },
//                 "tags": [],
//                 "author": {
//                     "username": "ramaa",
//                     "avatarURL": "",
//                     "reputationScore": "1.67"
//                 }
//             },]
//response from getOneProject
// {
//         "id": 4,
//         "title": "KMC-HUB",
//         "description": "A collaboration platform for students to share ideaas",
//         "liveURL": "http://localhost:8080",
//         "githubURL": "https://github.com/kasamthapa/critch",
//         "screenshotURL": "https://res.cloudinary.com/dqc0yoz3e/image/upload/v1774957063/pctbro2ljjzyda4ldk5t.png",
//         "screenshotPublicId": "pctbro2ljjzyda4ldk5t",
//         "created_at": "2026-03-31T11:37:44.039Z",
//         "updated_at": "2026-04-06T19:16:15.412Z",
//         "userId": 20,
//         "avgRating": "1.7",
//         "reviews": [
//             {
//                 "id": 1,
//                 "codeQuality": "3",
//                 "uiDesign": "2",
//                 "ideaScore": "3",
//                 "documentation": "1",
//                 "comment": "Better idea but working on production standards would be good",
//                 "avgReview": "0",
//                 "created_at": "2026-04-06T17:15:22.901Z",
//                 "userId": 21,
//                 "projectId": 4,
//                 "user": {
//                     "username": "kalu",
//                     "avatarURL": ""
//                 }
//             },
//             {
//                 "id": 2,
//                 "codeQuality": "3",
//                 "uiDesign": "2",
//                 "ideaScore": "3",
//                 "documentation": "0",
//                 "comment": "Better idea but working on production standards would be better",
//                 "avgReview": "2",
//                 "created_at": "2026-04-06T19:11:25.425Z",
//                 "userId": 22,
//                 "projectId": 4,
//                 "user": {
//                     "username": "kalue",
//                     "avatarURL": ""
//                 }
//             },
//             {
//                 "id": 3,
//                 "codeQuality": "3",
//                 "uiDesign": "4",
//                 "ideaScore": "1",
//                 "documentation": "4",
//                 "comment": "Better idea but working on production standards would be better",
//                 "avgReview": "3",
//                 "created_at": "2026-04-06T19:16:15.395Z",
//                 "userId": 23,
//                 "projectId": 4,
//                 "user": {
//                     "username": "kaluea",
//                     "avatarURL": ""
//                 }
//             }
//         ],
//         "tags": [
//             "node",
//             "react",
//             "typescript"
//         ],
//         "author": {
//             "username": "ramaa",
//             "avatarURL": "",
//             "reputationScore": "1.67"
//         }
//     },
import type { ApiResponse } from "./apiResponse.types";
import type { Review } from "./review.types";
export interface CreateProjectRequest {
  title: string;
  description: string;
  liveURL: string;
  githubURL: string;
  tags: string; // comma separated — "node,react,typescript"
  screenshot: File; // file upload — added separately since backend schema doesn't cover it
}

export interface ProjectAuthor {
  username: string;
  avatarURL: string;
  reputationScore: string;
}

export interface ProjectSummary {
  id: number;
  title: string;
  description: string;
  liveURL: string;
  githubURL: string;
  screenshotURL: string;
  screenshotPublicId: string;
  created_at: string;
  updated_at: string;
  userId: number;
  avgRating: string;
  tags: string[];
  author: ProjectAuthor;
  _count: {
    reviews: number;
  };
}
export interface ProjectDetail extends ProjectSummary {
  reviews: Review[];
}
export interface CreatedProject {
  id: number;
  title: string;
  description: string;
  liveURL: string;
  githubURL: string;
  screenshotURL: string;
  screenshotPublicId: string;
  created_at: string;
  updated_at: string;
  userId: number;
  avgRating: string;
  tags: string[];
}
export type GetAllProjectResponse = ApiResponse<{ projects: ProjectSummary[] }>;
export type GetOneProjectResponse = ApiResponse<ProjectDetail>;
export type CreateProjectResponse = ApiResponse<CreateProjectResponse>;
