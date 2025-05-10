// src\index.ts
import fr from './i18n/fr/translation.json';
import en from './i18n/en/translation.json';

/**
 * Components
 */
export { Guard } from './components/Guard';
export { Input } from './components/Input';
export { Footer } from './components/Footer';
export { Header } from './components/Header';
export { FlashMessage } from './components/FlashMessage';
export { LayoutPublic } from './components/layout/LayoutPublic';
export { LayoutProtected } from './components/layout/LayoutProtected';

/**
 * Hooks
 */
export { useFlashStore } from './hooks/useFlashStore';

/**
 * Pages
 */
export { CGU } from './components/pages/CGU';
export { Login } from './components/pages/Login';
export { Profile } from './components/pages/Profile';
export { NotFound } from './components/pages/NotFound';

/**
 * Commons
 */
export { CODES } from './commons/codes';

/**
 * Usecases
 */
export { SystemInfoUsecase } from './usecases/system/systemInfo.usecase';
export { SystemInfoUsecaseModel } from './usecases/system/model/systemInfo.usecase.model';
export { AuthUsecase } from './usecases/auth/auth.usecase';
export { AuthPasskeyUsecase } from './usecases/passkey/auth/authPasskey.usecase';
export { CreatePasskeyUsecase } from './usecases/passkey/create/createPasskey.usecase';
export { DeletePasskeyUsecase } from './usecases/passkey/delete/deletePasskey.usecase';
export { GetPasskeyForUserUsecase } from './usecases/passkey/getForUser/getPasskeyForUser.usecase';
export { SessionInfoUsecase } from './usecases/sessionInfo/systemInfo.usecase';
export { UpdPasswordUsecase } from './usecases/user/updPassword/updPassword.usecase';

/**
 * Services
 */
export { default as GraphqlService } from './services/graphql/graphql.service';
export { GraphqlServiceFake } from './services/graphql/graphql.service.fake';
export { GraphqlServiceFetch } from './services/graphql/graphql.service.fetch';
export { default as LoggerService } from './services/logger/logger.service'; 
export { LoggerServiceReal } from './services/logger/logger.service.real';

/**
 * I18n
 */
export const translation = {
  fr,
  en,
};