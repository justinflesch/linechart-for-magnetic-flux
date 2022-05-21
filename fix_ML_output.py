import pandas as pd

def convert_csv(csv_path):
    data_dict = {}

    df = pd.DataFrame(columns=['time', 'anomaly_score'])
    with open(csv_path, newline='') as csvfile:
        for idx, line in enumerate(csvfile):
            if idx == 0:
                line = line.split(",")
                line = [float(i) for i in line]
                df['time'] = line
            if idx == 1:
                line = line.split(",")
                line = [float(i) for i in line]
                df['anomaly_score'] = line

    #df = df.append(data_dict, ignore_index=True)
    print(df['time'])
    fixed_filepath = csv_path.rsplit(".", 1)[0] + "_fixed.csv"
    df.to_csv(fixed_filepath)

if __name__ == "__main__":
    convert_csv(r"C:\Users\jflesch\Capstone\LineChart\anomalydetection.csv")  # Path to machine-learning output data