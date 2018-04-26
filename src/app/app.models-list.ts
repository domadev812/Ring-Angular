import { BaseUser as ApiBaseUser } from './_models/base-user.model';
import { Prize as ApiPrize } from './_models/prize.model';
import { Campaign as ApiCampaign } from './_models/campaign.model';
import { Resource as ApiResource } from './_models/resource.model';
import { Career as ApiCareer } from './_models/career.model';
import { Organization as ApiOrganization } from './_models/organization.model';
import { Notification as ApiNotification } from './_models/notification.model';
import { RolesAccess as ApiRolesAccess } from './_models/roles-access.model';
import { Scholarship as ApiScholarship } from './_models/scholarship.model';
import { User as ApiUser } from './_models/user.model';
import { AwardedPrize as ApiAwardedPrize } from './_models/awarded-prize.model';
import { Application as ApiApplication } from './_models/application.model';
import { MessageBoard as ApiMessageBoard } from './_models/messageboard.model';
import { Approval as ApiApproval } from './_models/approval.model';
import { KeycardRecipient as ApiKeycardRecipient } from './_models/keycard-recipient.model';

export module Model {
    export type User = ApiUser;
    export const User = ApiUser;
    export type BaseUser = ApiBaseUser;
    export const BaseUser = ApiBaseUser;
    export type Prize = ApiPrize;
    export const Prize = ApiPrize;
    export type Campaign = ApiCampaign;
    export const Campaign = ApiCampaign;
    export type Resource = ApiResource;
    export const Resource = ApiResource;
    export type Career = ApiCareer;
    export const Career = ApiCareer;
    export type Organization = ApiOrganization;
    export const Organization = ApiOrganization;

    export type Notification = ApiNotification;
    export const Notification = ApiNotification;
    export type RolesAccess = ApiRolesAccess;
    export const RolesAccess = ApiRolesAccess;
    export type Scholarship = ApiScholarship;
    export const Scholarship = ApiScholarship;
    export type AwardedPrize = ApiAwardedPrize;
    export const AwardedPrize = ApiAwardedPrize;
    export type Application = ApiApplication;
    export const Application = ApiApplication;
    export type MessageBoard = ApiMessageBoard;
    export const MessageBoard = ApiMessageBoard;
    export type Approval = ApiApproval;
    export const Approval = ApiApproval;
    export type KeycardRecipient = ApiKeycardRecipient;
    export const KeycardRecipient = ApiKeycardRecipient;

    export function initializeArray<T>(array: T[], type: string): any[] {
        let newArray: T[] = [];
        if (array) {
            for (let instance of array) {
                newArray.push(new Model[type](instance));
            }
        }
        return newArray;
    }
}
