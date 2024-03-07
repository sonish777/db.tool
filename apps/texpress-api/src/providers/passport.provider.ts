import { Express, Request } from 'express';
import passport from 'passport';
import Container from 'typedi';
import config from 'config';
import { AuthService, DatabaseConfigurationService } from '@api/services';
import { ProviderStaticMethod } from 'core/providers';
import {
    ExtractJwt,
    Strategy as JWTStrategy,
    VerifiedCallback,
} from 'passport-jwt';

export class PassportProvider
    implements ProviderStaticMethod<typeof PassportProvider>
{
    private static readonly _authService = Container.get(AuthService);
    private static readonly _dbConfigService = Container.get(
        DatabaseConfigurationService
    );

    public static register(app: Express) {
        app.use(passport.initialize());
        passport.use(
            new JWTStrategy(
                {
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                    secretOrKey: config.get<string>('jwt.access:secret'),
                    passReqToCallback: true,
                },
                async (req: Request, payload: any, done: VerifiedCallback) => {
                    const dbConfig =
                        await PassportProvider._dbConfigService.findOne({
                            _id: payload._id,
                            accessToken: req.headers.authorization
                                ?.split('Bearer ')
                                .pop(),
                        });
                    if (!dbConfig) {
                        return done(null, false);
                    }
                    if (!req.connectionStore.get(dbConfig._id)) {
                        const decryptedPassword =
                            PassportProvider._dbConfigService.decipherDbConfigPassword(
                                dbConfig.password
                            );
                        const conn =
                            await PassportProvider._dbConfigService.testConnection(
                                {
                                    ...dbConfig,
                                    password: decryptedPassword,
                                }
                            );
                        req.connectionStore.set(dbConfig._id, conn);
                    }
                    return done(null, dbConfig);
                }
            )
        );
    }
}
