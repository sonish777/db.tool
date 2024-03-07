import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { ApiUserEntity, DatabaseConfigurationEntity } from 'shared/entities';
import { generateOTP } from 'shared/utils';
import { CreateUserDto, RefreshTokenDto, VerifyOTPDto } from '@api/dtos';
import {
    DTO,
    HttpStatus,
    Sanitize,
    ToPlain,
    validatePassword,
} from 'core/utils';
import { SetPasswordDto } from 'shared/dtos';
import { TokenService } from './token.service';
import { AuthEventsEmitter } from 'shared/events';
import { SocialLoginService } from './social.login.service';
import { SocialLoginInterface } from '@api/types';
import { HttpException } from 'core/exceptions';
import { CommonConfigs } from '@api/configs';
import { Cache } from 'shared/services';
import { CreateDBConfigDTO } from '@api/dtos/create-db-config.dto';
import { DatabaseConfigurationService } from './database-configuration.service';
import { ConnectionStore } from 'shared/data-sources';
import { Tokens } from '@api/schemas';
import knex from 'knex';

@Service()
export class AuthService extends BaseService<DatabaseConfigurationEntity> {
    @GetRepository(DatabaseConfigurationEntity)
    readonly repository: Repository<DatabaseConfigurationEntity>;
    protected resource: any = 'User';

    constructor(
        private readonly tokensService: TokenService,
        private readonly dbConfigService: DatabaseConfigurationService
    ) {
        super();
    }

    @Sanitize
    async connect(
        @DTO createDbConfigDto: CreateDBConfigDTO
    ): Promise<[DatabaseConfigurationEntity, Tokens, knex.Knex]> {
        const { conn, dbConfig } = await this.dbConfigService.createDbConfig(
            createDbConfigDto
        );
        const tokens = this.tokensService.signTokens({
            _id: dbConfig._id,
        });
        await this.dbConfigService.updateDbConfig(dbConfig._id, {
            accessToken: tokens.accessToken,
            password: dbConfig.password,
        });
        return [dbConfig, tokens, conn];
    }

    @ToPlain
    @AuthEventsEmitter('send-otp', (user: ApiUserEntity) => [
        {
            user_name: `${user.firstName} ${user.lastName}`,
            otp_code: user.token,
            to_email: user.email,
        },
    ])
    @Sanitize
    async register(
        @DTO
        createUserDto: CreateUserDto
    ) {
        // const otp = await this.generateAndSendOTP();
        // const user = await this.create({
        //     ...createUserDto,
        //     token: otp,
        //     tokenExpiry: new Date(
        //         Date.now() + CommonConfigs.Otp.NextOtpWaitTime
        //     ),
        // });
        // return user;
    }

    generateAndSendOTP(): Promise<string> {
        if (process.env.NODE_ENV !== 'production') {
            return Promise.resolve('000000');
        }
        return generateOTP();
    }

    @Sanitize
    async verifyOtp(@DTO verifyOTPDto: VerifyOTPDto) {
        // const { username, otpCode } = verifyOTPDto;
        // const user = await this.findUserByUsername(username);
        // if (
        //     user.token !== otpCode ||
        //     moment().isAfter(moment(user.tokenExpiry))
        // ) {
        //     throw new BadRequestException('Invalid OTP code');
        // }
        // user.token = '';
        // user.tokenExpiry = new Date();
        // if (user.status === UserStatusEnum.Inactive) {
        //     user.status = UserStatusEnum.OTPVerified;
        // }
        // user.tokenVerified = true;
        // return this.repository.save(user);
    }

    @Sanitize
    async setPassword(@DTO setPasswordDto: SetPasswordDto) {
        // const user = await this.findUserByUsername(setPasswordDto.username);
        // if (user.tokenVerified === false) {
        //     throw new BadRequestException(
        //         'Resend and verify OTP to set your password.'
        //     );
        // }
        // user.password = setPasswordDto.password;
        // user.status = UserStatusEnum.Active;
        // user.tokenVerified = false;
        // await this.repository.save(user);
        // return this.tokensService.signTokens(user);
    }

    @ToPlain
    getProfile(userId: string) {
        return this.findOrFail({
            _id: userId,
        });
    }

    async logout(accessToken?: string) {
        const dbConfig = await this.findOne({
            accessToken,
        });
        if (!dbConfig) {
            return;
        }
        await this.save({
            ...dbConfig,
            accessToken: null,
        });
    }

    getAccessTokenFromRefreshToken(refreshTokenDto: RefreshTokenDto) {
        return this.tokensService.refresh(refreshTokenDto.refreshToken);
    }
}
