(function() {
    const width = 1280;
    const height = 720;
    const degrees_to_radians = Math.PI/180;
    const angle_mod = 20;

    class Branch {
        start_x: number;
        start_y: number;
        angle: number;
        length: number;
        cur_length: number;
        split: boolean;
        constructor(start_x: number, start_y: number, angle: number, length: number) {
            this.start_x = start_x;
            this.start_y = start_y;
            this.angle = angle;
            this.length = length;

            this.split = false;
            this.cur_length = 0;
        }

        get_end_x() {
            return this.start_x + this.cur_length * Math.cos(this.angle * degrees_to_radians);
        }

        get_end_y() {
            return this.start_y + this.cur_length * Math.sin(this.angle * degrees_to_radians);
        }
    }

    function get_random_length(start_length) {
        return start_length - (5 + (Math.random() * 15));
    }

    function get_random_angle(start_angle, direction) {
        return start_angle + direction * (angle_mod + (Math.random() * 10));
    }

    function main() {
        const canvas = <HTMLCanvasElement> document.getElementById("canvas");
        const context = <CanvasRenderingContext2D> canvas.getContext("2d");
        var branches: Branch[] = [],
            zero_reached = false;

        canvas.width = width;
        canvas.height = height;

        branches.push(new Branch(
            width / 2,
            height,
            -90,
            100
        ));

        let update = function() {
            if(zero_reached === false) {
                let new_branches: Branch[] = [];
                let nothing_updated = true;

                branches.forEach((branch) => {
                    if(branch.split === false && branch.cur_length >= branch.length) {
                        nothing_updated = false;
                        branch.split = true;
                        

                        var branch_one = new Branch(
                            branch.get_end_x(),
                            branch.get_end_y(),
                            get_random_angle(branch.angle, 1.0),
                            get_random_length(branch.length)
                        );

                        var branch_two = new Branch(
                            branch.get_end_x(),
                            branch.get_end_y(),
                            get_random_angle(branch.angle, -1.0),
                            get_random_length(branch.length)
                        );

                        if(branch_one.length > 0) {
                            new_branches.push(branch_one);
                        }
                        if(branch_two.length > 0) {
                            new_branches.push(branch_two);
                        }
                    } else if(branch.cur_length < branch.length) {
                        nothing_updated = false;
                        branch.cur_length += 4;
                    }
                });
                zero_reached = nothing_updated;
                if(new_branches.length > 0) {
                    branches = branches.concat(new_branches);
                }
            }
        };

        let render = function() {
            branches.forEach((branch) => {
                context.beginPath();
                context.moveTo(
                    branch.start_x,
                    branch.start_y
                );
                context.lineTo(
                    branch.start_x + (branch.cur_length * Math.cos(branch.angle * degrees_to_radians)),
                    branch.start_y + (branch.cur_length * Math.sin(branch.angle * degrees_to_radians))
                );
                context.stroke();
            });
        };

        let game_loop = function() {
            update();
            render();
            requestAnimationFrame(game_loop);
        };

        requestAnimationFrame(game_loop);
    }

    window.onload = main;
})();