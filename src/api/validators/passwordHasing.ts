import { once } from "events";
import path from "path";
import { Worker } from "worker_threads";
import bcrypt from 'bcrypt';

class passwordHashing {

    public async hashPassword(password: string): Promise<string> {
        const worker = new Worker(path.resolve(__dirname, '../../util/passwordWorker.ts'));
        worker.postMessage({ password });

        const [data] = await once(worker, 'message');
        worker.terminate();

        if(!data.success) {
            throw new Error(data.error);
        }
        return data.hashed;

    }

    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        console.log("password",hashedPassword);
        console.log("comparing passwords",await bcrypt.compare(password, hashedPassword));
        return bcrypt.compare(password, hashedPassword);
    }
}

export default new passwordHashing();