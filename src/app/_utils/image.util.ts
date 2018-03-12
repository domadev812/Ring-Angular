import { environment } from '../../environments/environment';

export module ImageUtil {
    export function createImageUrl(id: string, imageId: string) {
        return `${environment.apiUrl}/api/assets/images/${id}/${imageId}`;
    }
}